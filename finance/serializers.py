from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Transaction

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type']
        read_only_fields = ['id']

    def create(self, validated_data):
        user = self.context['request'].user
        return Category.objects.create(user=user, **validated_data)

class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.none()
    )

    class Meta:
        model = Transaction
        fields = ['id', 'category', 'amount', 'date', 'note']
        read_only_fields = ['id']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ограничиваем категории текущим пользователем
        user = self.context['request'].user
        self.fields['category'].queryset = Category.objects.filter(user=user)

    def create(self, validated_data):
        user = self.context['request'].user
        return Transaction.objects.create(user=user, **validated_data)
