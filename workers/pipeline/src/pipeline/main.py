import json
import logging
import sys
import uuid

from apscheduler.schedulers.blocking import BlockingScheduler

log = logging.getLogger("pipeline")


class JsonFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps(
            {
                "ts": self.formatTime(record),
                "severity": record.levelname,
                "service": "pipeline",
                "job_id": getattr(record, "job_id", None),
                "message": record.getMessage(),
            }
        )


def poll_sources() -> None:
    log.info("poll tick (no sources configured yet)", extra={"job_id": str(uuid.uuid4())})


def main() -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    log.addHandler(handler)
    log.setLevel(logging.INFO)
    scheduler = BlockingScheduler()
    scheduler.add_job(poll_sources, "interval", minutes=5)
    log.info("pipeline worker started")
    scheduler.start()


if __name__ == "__main__":
    main()
