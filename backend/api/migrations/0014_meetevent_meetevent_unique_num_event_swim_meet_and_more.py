# Generated by Django 4.2.9 on 2024-03-07 01:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_timerecord'),
    ]

    operations = [
        migrations.CreateModel(
            name='MeetEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num_event', models.PositiveSmallIntegerField()),
                ('event_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='event_type', to='api.eventtype')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='event_group', to='api.group')),
                ('swim_meet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='event_meet', to='api.swimmeet')),
            ],
        ),
        migrations.AddConstraint(
            model_name='meetevent',
            constraint=models.UniqueConstraint(fields=('swim_meet', 'num_event'), name='unique_num_event_swim_meet'),
        ),
        migrations.AddConstraint(
            model_name='meetevent',
            constraint=models.UniqueConstraint(fields=('swim_meet', 'event_type', 'group'), name='unique_group_event_type_swim_meet'),
        ),
    ]
