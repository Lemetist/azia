export const sidebarItems = [
  { href: "/overview", label: "Обзор", key: "overview" },
  { href: "/schedule", label: "Расписание", key: "schedule" },
  { href: "/workouts", label: "Workouts", key: "workouts" },
  { href: "/coaches", label: "Тренеры", key: "coaches" },
  { href: "/progress", label: "Прогресс", key: "progress" },
  { href: "/membership", label: "Абонемент", key: "membership" },
  { href: "/profile", label: "Профиль", key: "profile" },
] as const;

export const statCards = [
  { label: "Тренировок в цикле", value: "18", change: "+3 за неделю", tone: "accent" },
  { label: "Готовность", value: "84%", change: "Стабильно", tone: "neutral" },
  { label: "Посещаемость", value: "91%", change: "Выше цели", tone: "neutral" },
] as const;

export const nextWorkouts = [
  {
    title: "Strength Forge",
    coach: "Marcus Bell",
    time: "Сегодня · 18:30",
    tag: "Низ тела",
  },
  {
    title: "Pool Conditioning",
    coach: "Nina Park",
    time: "Завтра · 07:15",
    tag: "45 минут",
  },
  {
    title: "Tempo Run",
    coach: "Arseniy Volk",
    time: "Чт · 06:45",
    tag: "8 км",
  },
] as const;

export const overviewActions = [
  {
    title: "Открыть расписание",
    description: "Проверить ближайшие слоты и записаться на силовой блок.",
    href: "/schedule",
  },
  {
    title: "Посмотреть прогресс",
    description: "Сверить темп, объем и восстановление перед следующей неделей.",
    href: "/progress",
  },
  {
    title: "Уточнить тариф",
    description: "Понять, что входит в текущий план и когда продление.",
    href: "/membership",
  },
] as const;

export const recoverySignals = [
  { label: "Сон", value: "7ч 48м", status: "Хорошо" },
  { label: "Пульс покоя", value: "54", status: "Ниже базы" },
  { label: "Готовность", value: "84%", status: "Можно нагружать" },
] as const;

export const scheduleDays = [
  {
    day: "Пн",
    date: "07 апр",
    load: "Высокая нагрузка",
    sessions: [
      {
        time: "06:45",
        title: "Беговой клуб",
        meta: "8 км · городской маршрут",
        coach: "Arseniy Volk",
        spots: "12 мест",
        status: "Открыта запись",
      },
      {
        time: "18:30",
        title: "Strength Forge",
        meta: "Зал A · основная силовая",
        coach: "Marcus Bell",
        spots: "4 места",
        status: "Основной слот",
      },
    ],
  },
  {
    day: "Вт",
    date: "08 апр",
    load: "Смешанный день",
    sessions: [
      {
        time: "07:15",
        title: "Pool Conditioning",
        meta: "Дорожка 3 · дыхание и темп",
        coach: "Nina Park",
        spots: "7 мест",
        status: "Открыта запись",
      },
      {
        time: "19:00",
        title: "Основы бокса",
        meta: "Зона единоборств · техника",
        coach: "Marcus Bell",
        spots: "2 места",
        status: "Почти заполнено",
      },
    ],
  },
  {
    day: "Ср",
    date: "09 апр",
    load: "Восстановление + темп",
    sessions: [
      {
        time: "08:00",
        title: "Mobility Reset",
        meta: "Recovery lounge · подвижность",
        coach: "Nina Park",
        spots: "16 мест",
        status: "Легкий блок",
      },
      {
        time: "18:00",
        title: "Functional Circuit",
        meta: "Основной зал · круговая работа",
        coach: "Marcus Bell",
        spots: "5 мест",
        status: "Рекомендуем",
      },
    ],
  },
] as const;

export const coaches = [
  {
    name: "Marcus Bell",
    role: "Силовой тренер",
    focus: "Гипертрофия, техника со штангой, цикл под рост силы",
    image: "/images/gym-reference.jpg",
    experience: "9 лет опыта",
    availability: "Свободен для 2 новых атлетов",
    speciality: "Barbell systems",
  },
  {
    name: "Nina Park",
    role: "Тренер по плаванию",
    focus: "Выносливость, контроль дыхания, темп восстановления",
    image: "/images/gym-bg.png",
    experience: "7 лет опыта",
    availability: "Свободна по утрам",
    speciality: "Engine + recovery",
  },
  {
    name: "Arseniy Volk",
    role: "Тренер по бегу",
    focus: "Пороговая работа, каденс, подготовка к забегу 10 км",
    image: "/images/gym-reference.jpg",
    experience: "6 лет опыта",
    availability: "Свободен по вторникам",
    speciality: "Running economy",
  },
] as const;

export const coachFormats = [
  {
    title: "Индивидуальные сессии",
    description: "Подходят для техники, корректировки движения и персональной прогрессии.",
  },
  {
    title: "Малые группы",
    description: "Для тех, кому важны темп, атмосфера и фиксированная недельная структура.",
  },
  {
    title: "Удаленный чек-ин",
    description: "Еженедельный разбор трекера, плана и самочувствия без посещения клуба.",
  },
] as const;

export const milestones = [
  { label: "Вес", current: "78 кг", target: "74 кг", delta: "-1.8 кг за 5 недель" },
  { label: "VO2 max", current: "49", target: "54", delta: "+3 пункта за месяц" },
  { label: "Жим лежа", current: "92 кг", target: "105 кг", delta: "+7 кг к прошлому циклу" },
] as const;

export const trendBars = [
  { label: "Объем", value: "14%", width: "82%" },
  { label: "Темп", value: "9%", width: "64%" },
  { label: "Восстановление", value: "6%", width: "52%" },
] as const;

export const plans = [
  {
    name: "Элитный доступ",
    price: "7 900 ₽/мес.",
    description: "Безлимитный зал, 8 классов в месяц и базовая аналитика по нагрузке.",
    status: "Текущий тариф",
    perks: ["Зал без ограничений", "8 групповых слотов", "1 ревью с тренером"],
  },
  {
    name: "Performance+",
    price: "11 900 ₽/мес.",
    description: "Расширенный план с персональным разбором, трекером и доп. окном записи.",
    status: "Рекомендуем",
    perks: ["Все из базового", "2 персональных сессии", "Разбор питания и сна"],
  },
] as const;

export const membershipBenefits = [
  {
    title: "Безлимитный доступ",
    description: "Тренажерный зал, раздевалка, recovery lounge и открытые зоны.",
  },
  {
    title: "Приоритет на классы",
    description: "Раннее окно бронирования для самых загруженных вечерних слотов.",
  },
  {
    title: "Разбор с тренером",
    description: "Ежемесячная сверка целей, техники и текущего тренировочного цикла.",
  },
] as const;

export const profileFacts = [
  { label: "Цель", value: "Рекомпозиция и забег 10 км в июне" },
  { label: "Посещаемость", value: "19 занятий в этом месяце" },
  { label: "Продление", value: "12 апреля 2026" },
] as const;

export const profilePreferences = [
  { label: "Основной слот", value: "Будни, 18:00-20:00" },
  { label: "Фокус цикла", value: "Сила + беговая выносливость" },
  { label: "Синхронизация", value: "Apple Watch, обновление 18 минут назад" },
] as const;
