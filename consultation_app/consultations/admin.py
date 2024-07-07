from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Consultation


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone', 'address', 'bio', 'photo')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_doctor', 'is_user', 'groups',
                                    'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'is_doctor', 'is_user', 'phone', 'address', 'bio', 'photo'),
        }),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_doctor', 'is_user')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'phone', 'address')
    ordering = ('username',)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Consultation)