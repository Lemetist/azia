from django.contrib import admin, messages
from django.contrib.admin.sites import NotRegistered
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html, format_html_join

from .models import (
    Coach,
    ScheduleBooking,
    ScheduleSlot,
    UserProfile,
    Workout,
    WorkoutPhase,
    WorkoutSession,
)


admin.site.site_header = "Primal Training Admin"
admin.site.site_title = "Primal Training"
admin.site.index_title = "Управление клубом"


@admin.action(description="Пересчитать персональные планы")
def regenerate_personal_plans(modeladmin, request, queryset):
    updated_count = 0

    for profile in queryset.select_related("user"):
        profile.regenerate_plan()
        profile.save(
            update_fields=[
                "nutrition_recommendations",
                "daily_workout",
                "updated_at",
            ]
        )
        updated_count += 1

    modeladmin.message_user(
        request,
        f"Пересчитано персональных планов: {updated_count}.",
        level=messages.SUCCESS,
    )


@admin.action(description="Пересчитать планы выбранных пользователей")
def regenerate_selected_user_plans(modeladmin, request, queryset):
    profiles = UserProfile.objects.select_related("user").filter(user__in=queryset)
    updated_count = 0

    for profile in profiles:
        profile.regenerate_plan()
        profile.save(
            update_fields=[
                "nutrition_recommendations",
                "daily_workout",
                "updated_at",
            ]
        )
        updated_count += 1

    modeladmin.message_user(
        request,
        f"Пересчитано персональных планов: {updated_count}.",
        level=messages.SUCCESS,
    )


def format_user_identity(user):
    full_name = user.get_full_name().strip()
    return full_name or user.email or user.username


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    extra = 0
    max_num = 1
    fields = (
        "sex",
        "age",
        "height_cm",
        "weight_kg",
        "goal",
        "nutrition_recommendations",
        "daily_workout",
        "created_at",
        "updated_at",
    )
    readonly_fields = ("created_at", "updated_at")


class PrimalUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    actions = (*UserAdmin.actions, regenerate_selected_user_plans)
    list_display = (
        "username",
        "email",
        "full_name",
        "profile_goal",
        "is_staff",
        "is_active",
        "date_joined",
    )
    list_select_related = ("profile",)

    @admin.display(description="Имя")
    def full_name(self, obj):
        return obj.get_full_name().strip() or "—"

    @admin.display(description="Цель", ordering="profile__goal")
    def profile_goal(self, obj):
        profile = getattr(obj, "profile", None)
        return profile.get_goal_display() if profile else "Анкета не заполнена"


class WorkoutPhaseInline(admin.TabularInline):
    model = WorkoutPhase
    extra = 0
    fields = ("position", "label", "value", "tone", "width")


class ScheduleSlotInline(admin.TabularInline):
    model = ScheduleSlot
    extra = 0
    autocomplete_fields = ("coach",)
    fields = (
        "position",
        "day",
        "date",
        "time",
        "title",
        "coach",
        "spots",
        "status",
    )


class ScheduleBookingInline(admin.TabularInline):
    model = ScheduleBooking
    extra = 0
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at",)
    fields = ("user", "created_at")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user_email",
        "full_name",
        "goal",
        "age",
        "body_metrics",
        "plan_status",
        "updated_at",
    )
    list_filter = ("sex", "goal", "created_at", "updated_at")
    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
    )
    autocomplete_fields = ("user",)
    readonly_fields = ("created_at", "updated_at")
    actions = (regenerate_personal_plans,)
    fieldsets = (
        (
            "Пользователь",
            {
                "fields": (
                    "user",
                    "sex",
                    "age",
                    "height_cm",
                    "weight_kg",
                    "goal",
                )
            },
        ),
        (
            "Персональный план",
            {
                "fields": (
                    "nutrition_recommendations",
                    "daily_workout",
                )
            },
        ),
        ("Служебные поля", {"fields": ("created_at", "updated_at")}),
    )

    @admin.display(description="Email", ordering="user__email")
    def user_email(self, obj):
        return obj.user.email

    @admin.display(description="Имя", ordering="user__first_name")
    def full_name(self, obj):
        return obj.user.get_full_name().strip() or "—"

    @admin.display(description="Параметры")
    def body_metrics(self, obj):
        return f"{obj.height_cm} см / {obj.weight_kg} кг"

    @admin.display(description="План")
    def plan_status(self, obj):
        return "Актуален" if obj.has_current_plan() else "Нужен пересчет"


@admin.register(Coach)
class CoachAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "role",
        "speciality",
        "experience",
        "availability",
        "schedule_slots_count",
    )
    search_fields = ("name", "role", "focus", "speciality")
    list_filter = ("role", "speciality", "availability")

    @admin.display(description="Слотов")
    def schedule_slots_count(self, obj):
        return obj.schedule_slots.count()


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "slug",
        "category",
        "duration",
        "level",
        "phases_count",
        "schedule_slots_count",
    )
    list_filter = ("category", "accent", "level")
    search_fields = ("title", "slug", "description", "detail_meta")
    prepopulated_fields = {"slug": ("title",)}
    inlines = (WorkoutPhaseInline, ScheduleSlotInline)

    @admin.display(description="Фаз")
    def phases_count(self, obj):
        return obj.phases.count()

    @admin.display(description="Слотов")
    def schedule_slots_count(self, obj):
        return obj.schedule_slots.count()


@admin.register(WorkoutPhase)
class WorkoutPhaseAdmin(admin.ModelAdmin):
    list_display = ("workout", "position", "label", "value", "tone", "width")
    list_filter = ("tone", "workout__category")
    search_fields = ("label", "workout__title", "workout__slug")
    autocomplete_fields = ("workout",)
    list_editable = ("position", "value", "tone", "width")


@admin.register(ScheduleSlot)
class ScheduleSlotAdmin(admin.ModelAdmin):
    list_display = (
        "position",
        "day",
        "date",
        "time",
        "title",
        "coach",
        "workout",
        "spots",
        "status",
        "bookings_count",
        "booked_members_preview",
    )
    list_filter = ("day", "status", "coach", "workout__category")
    search_fields = (
        "day",
        "date",
        "time",
        "title",
        "meta",
        "coach__name",
        "workout__title",
        "workout__slug",
    )
    autocomplete_fields = ("coach", "workout")
    list_editable = ("day", "date", "time", "spots", "status")
    readonly_fields = ("booked_members",)
    inlines = (ScheduleBookingInline,)

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("coach", "workout")
            .prefetch_related("bookings__user")
        )

    @admin.display(description="Записей")
    def bookings_count(self, obj):
        return obj.bookings.count()

    @admin.display(description="Кто записан")
    def booked_members_preview(self, obj):
        users = [booking.user for booking in obj.bookings.all()]

        if not users:
            return "Нет записей"

        visible_users = users[:3]
        preview = ", ".join(format_user_identity(user) for user in visible_users)
        hidden_count = len(users) - len(visible_users)

        if hidden_count > 0:
            return f"{preview} и еще {hidden_count}"

        return preview

    @admin.display(description="Записавшиеся участники")
    def booked_members(self, obj):
        if not obj.pk:
            return "Сохраните занятие, чтобы увидеть записи."

        bookings = obj.bookings.select_related("user").order_by("created_at")

        if not bookings:
            return "Пока никто не записался."

        items = format_html_join(
            "",
            "<li><strong>{}</strong><br><span>{}</span></li>",
            (
                (format_user_identity(booking.user), booking.user.email)
                for booking in bookings
            ),
        )
        return format_html("<ul>{}</ul>", items)


@admin.register(ScheduleBooking)
class ScheduleBookingAdmin(admin.ModelAdmin):
    list_display = ("user_email", "slot", "coach", "created_at")
    list_filter = ("created_at", "slot__day", "slot__coach")
    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
        "slot__title",
        "slot__coach__name",
    )
    autocomplete_fields = ("user", "slot")
    readonly_fields = ("created_at",)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user", "slot__coach")

    @admin.display(description="Email", ordering="user__email")
    def user_email(self, obj):
        return obj.user.email

    @admin.display(description="Тренер", ordering="slot__coach__name")
    def coach(self, obj):
        return obj.slot.coach.name


@admin.register(WorkoutSession)
class WorkoutSessionAdmin(admin.ModelAdmin):
    list_display = (
        "user_email",
        "workout",
        "elapsed_time",
        "completed_at",
    )
    list_filter = ("completed_at", "workout__category", "workout")
    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
        "workout__title",
        "workout__slug",
    )
    autocomplete_fields = ("user", "workout")
    readonly_fields = ("completed_at",)

    @admin.display(description="Email", ordering="user__email")
    def user_email(self, obj):
        return obj.user.email

    @admin.display(description="Длительность")
    def elapsed_time(self, obj):
        minutes, seconds = divmod(obj.elapsed_seconds, 60)
        return f"{minutes:02d}:{seconds:02d}"


try:
    admin.site.unregister(User)
except NotRegistered:
    pass

admin.site.register(User, PrimalUserAdmin)
