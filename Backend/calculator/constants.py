CRYPTO_BASELINE_RETURNS = {
    "bitcoin": 0.80,
    "ethereum": 0.60,
    "solana": 1.20,
    "tether": 0.08,
    "usd-coin": 0.07,
}

TRADITIONAL_INSTRUMENTS = [
    {
        "key": "pagibig_mp2",
        "label": "Pag-IBIG MP2",
        "category": "government",
        "annual_return": 0.0710,
        "last_updated": "2024",
        "rate_type": "declared_annual_dividend",
        "source_note": "Manual update from Pag-IBIG official annual declaration.",
    },
    {
        "key": "pagibig_regular",
        "label": "Pag-IBIG Regular Savings",
        "category": "government",
        "annual_return": 0.0660,
        "last_updated": "2024",
        "rate_type": "declared_annual_dividend",
        "source_note": "Manual update from Pag-IBIG official annual declaration.",
    },
    {
        "key": "sss_peso",
        "label": "SSS PESO Fund",
        "category": "government",
        "annual_return": 0.0500,
        "last_updated": "2024",
        "rate_type": "declared_or_historical_dividend",
        "source_note": "Manual update from SSS official PESO Fund disclosures.",
    },
    {
        "key": "tbill_rtb",
        "label": "Treasury Bills / RTBs",
        "category": "government",
        "annual_return": 0.0550,
        "last_updated": "2024",
        "rate_type": "auction_baseline_proxy",
        "source_note": "Manual update from Bureau of Treasury auction results.",
    },
    {
        "key": "psei_baseline",
        "label": "PSEi Historical Baseline",
        "category": "equities",
        "annual_return": 0.1100,
        "last_updated": "2024",
        "rate_type": "historical_cagr_assumption",
        "source_note": "Approximation baseline; use market data ingestion later.",
    },
    {
        "key": "bank_time_deposit",
        "label": "Bank Time Deposit (1Y baseline)",
        "category": "banking",
        "annual_return": 0.0500,
        "last_updated": "2024",
        "rate_type": "market_range_baseline",
        "source_note": "Manual update from bank published rates/BSP references.",
    },
    {
        "key": "real_estate_baseline",
        "label": "Real Estate Appreciation Baseline",
        "category": "real_estate",
        "annual_return": 0.0600,
        "last_updated": "2024",
        "rate_type": "historical_index_baseline",
        "source_note": "Manual update from BSP RREPI releases.",
    },
]

MODE_MULTIPLIERS = {
    "conservative": 0.45,
    "moderate": 1.0,
    "aggressive": 1.75,
}

INSTRUMENT_ALIASES = {
    "traditional": {
        "pagibig": "pagibig_mp2",
        "tbill": "tbill_rtb",
        "td": "bank_time_deposit",
        "realestate": "real_estate_baseline",
    },
    "crypto": {
        "usdt": "tether",
    },
}
