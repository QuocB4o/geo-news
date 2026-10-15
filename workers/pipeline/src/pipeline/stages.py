from enum import StrEnum


class Stage(StrEnum):
    DISCOVERED = "discovered"
    NORMALIZED = "normalized"
    DEDUPLICATED = "deduplicated"
    ENRICHED = "enriched"
    GEOCODED_OR_UNKNOWN = "geocoded_or_unknown"
    EMBEDDED = "embedded"
    CLUSTERED = "clustered"
    PUBLISHABLE = "publishable"


class Status(StrEnum):
    PENDING = "pending"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    RETRYABLE_FAILED = "retryable_failed"
    PERMANENT_FAILED = "permanent_failed"
