from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Consultation


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'is_doctor', 'is_user', 'is_staff')
    list_filter = ('is_doctor', 'is_user', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions',
         {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_doctor', 'is_user', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'is_doctor', 'is_user')}
         ),
    )
    search_fields = ('username', 'email')
    ordering = ('username',)


admin.site.register(CustomUser, CustomUserAdmin)


class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('user', 'doctor', 'date', 'notes')
    list_filter = ('doctor', 'date')
    search_fields = ('user__username', 'doctor__username', 'date')


admin.site.register(Consultation, ConsultationAdmin)
