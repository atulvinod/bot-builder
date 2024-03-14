class AppError(Exception):

    def __init__(self, message, error_code, *args: object) -> None:
        super().__init__(*args)
        self.errorCode = error_code
        self.message = message
