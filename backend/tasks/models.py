from django.db import models


class Task(models.Model):

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    CATEGORY_CHOICES = [
        ("work", "Work"),
        ("study", "Study"),
        ("personal", "Personal"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=150)

    description = models.TextField(
        blank=True,
        default=""
    )

    completed = models.BooleanField(
        default=False
    )

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default="medium"
    )

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="personal"
    )

    due_date = models.DateField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["completed", "due_date", "-created_at"]

    def __str__(self):
        return self.title
