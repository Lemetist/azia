import sys

from django import VERSION as DJANGO_VERSION
from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"
    _template_context_copy_patched = False

    def ready(self):
        self._patch_template_context_copy_for_python_314()

    @classmethod
    def _patch_template_context_copy_for_python_314(cls):
        if cls._template_context_copy_patched:
            return

        if sys.version_info < (3, 14) or DJANGO_VERSION >= (5, 2):
            return

        from django.template.context import BaseContext

        def copy_template_context(context):
            duplicate = context.__class__.__new__(context.__class__)
            duplicate.__dict__.update(context.__dict__)
            duplicate.dicts = context.dicts[:]
            return duplicate

        BaseContext.__copy__ = copy_template_context
        cls._template_context_copy_patched = True
