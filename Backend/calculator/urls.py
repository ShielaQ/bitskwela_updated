from django.urls import path

from .views import calculate, crypto_instruments, investments, rates

urlpatterns = [
    path("", investments, name="calculator-investments"),
    path("rates/", rates, name="calculator-rates"),
    path("crypto/", crypto_instruments, name="calculator-crypto-instruments"),
    path("calculate/", calculate, name="calculator-calculate"),
]
