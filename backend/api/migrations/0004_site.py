# Generated by Django 4.2.9 on 2024-02-10 06:35

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_add_collation_to_first_and_last_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Site',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('num_lanes', models.PositiveSmallIntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('pool_len', models.PositiveSmallIntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('len_unit', models.CharField(choices=[('yd', 'Yards'), ('m', 'Meters')], default='yd', max_length=20)),
            ],
        ),
    ]
