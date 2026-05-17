from app.models.threat import ThreatStatus, ThreatType


TYPE_LABELS: dict[ThreatType, str] = {
    ThreatType.drone: "БПЛА",
    ThreatType.jet_drone: "Реактивний БПЛА",
    ThreatType.shahed: "Шахед",
    ThreatType.cruise_missile: "Крилева ракета",
    ThreatType.ballistic_missile: "Балістична ракета",
    ThreatType.bomb: "КАБ",
    ThreatType.air_threat: "Повітряна ціль",
    ThreatType.unknown: "Невідома ціль",
}

STATUS_LABELS: dict[ThreatStatus, str] = {
    ThreatStatus.active: "Активна ціль",
    ThreatStatus.eliminated: "Знищено",
    ThreatStatus.lost: "Втрачено",
    ThreatStatus.hit_target: "Влучання",
    ThreatStatus.unknown: "Невідомо",
}

PLACE_LABELS = {
    "kyiv": "Київ",
    "kiev": "Київ",
    "kharkiv": "Харків",
    "odesa": "Одеса",
    "odessa": "Одеса",
    "dnipro": "Дніпро",
    "zaporizhzhia": "Запоріжжя",
    "zaporizhia": "Запоріжжя",
    "lviv": "Львів",
    "mykolaiv": "Миколаїв",
    "kherson": "Херсон",
    "chernihiv": "Чернігів",
    "sumy": "Суми",
    "poltava": "Полтава",
    "vinnytsia": "Вінниця",
    "cherkasy": "Черкаси",
    "kropyvnytskyi": "Кропивницький",
    "rivne": "Рівне",
    "lutsk": "Луцьк",
    "ternopil": "Тернопіль",
    "ivano-frankivsk": "Івано-Франківськ",
    "uzhhorod": "Ужгород",
    "chernivtsi": "Чернівці",
    "zhytomyr": "Житомир",
    "khmelnytskyi": "Хмельницький",
    "donetsk": "Донецьк",
    "luhansk": "Луганськ",
    "crimea": "Крим",
}


def type_label(value: ThreatType) -> str:
    return TYPE_LABELS.get(value, TYPE_LABELS[ThreatType.unknown])


def status_label(value: ThreatStatus) -> str:
    return STATUS_LABELS.get(value, STATUS_LABELS[ThreatStatus.unknown])


def place_label(value: object) -> str | None:
    if value in (None, ""):
        return None
    text = str(value).strip()
    normalized = text.lower().replace("_", "-")
    return PLACE_LABELS.get(normalized, text)
