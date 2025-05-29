from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Category(models.Model):
    INCOME = 'income'
    EXPENSE = 'expense'
    TYPE_CHOICES = [
        (INCOME, 'Доход'),
        (EXPENSE, 'Расход'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=7, choices=TYPE_CHOICES)

    class Meta:
        unique_together = ('user', 'name', 'type')
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return f"{self.get_type_display()}: {self.name}"

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)
    note = models.TextField(blank=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Транзакция'
        verbose_name_plural = 'Транзакции'

    def __str__(self):
        return f"{self.date.date()} | {self.category.name} | {self.amount}"
