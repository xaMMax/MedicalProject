# Generated by Django 5.0.6 on 2024-07-22 05:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('consultations', '0005_alter_customuser_managers'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='customuser',
            options={},
        ),
        migrations.AlterModelTable(
            name='customuser',
            table='CustomUser',
        ),
    ]