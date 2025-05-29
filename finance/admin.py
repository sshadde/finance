from django.contrib import admin
from .models import Category, Transaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'user')
    list_filter = ('type',)
    search_fields = ('name', 'user__username')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('date', 'user', 'category', 'amount')
    list_filter = ('category__type', 'date')
    search_fields = ('category__name', 'user__username', 'note')
