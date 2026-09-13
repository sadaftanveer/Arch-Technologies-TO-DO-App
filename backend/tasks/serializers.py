from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = "__all__"

    def validate_title(self, value):
     value = value.strip()

     if not value:
        raise serializers.ValidationError(
            "Task title cannot be empty."
        )

     cleaned_title = value.replace('"', "").replace("'", "").strip()

     if not cleaned_title:
        raise serializers.ValidationError(
            "Task title cannot be empty."
        )

     if len(value) > 150:
        raise serializers.ValidationError(
            "Task title cannot exceed 150 characters."
        )
     return value

    

    def validate_description(self, value):
        if value and len(value.strip()) > 500:
            raise serializers.ValidationError(
                "Description cannot exceed 500 characters."
            )

        return value.strip() if value else value

    def validate_priority(self, value):
        allowed_priorities = ["low", "medium", "high"]

        if value not in allowed_priorities:
            raise serializers.ValidationError(
                "Priority must be low, medium, or high."
            )

        return value

    def validate_category(self, value):
        allowed_categories = [
            "work",
            "study",
            "personal",
            "other",
        ]

        if value not in allowed_categories:
            raise serializers.ValidationError(
                "Category must be work, study, personal, or other."
            )

        return value