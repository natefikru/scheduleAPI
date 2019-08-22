import arrow


class Helpers():

    @staticmethod
    def check_shift_overlap(input_start_time, input_end_time, user_shift, shift_id=None):
        db_start_time = arrow.get(user_shift.start_time).timestamp
        db_end_time = arrow.get(user_shift.end_time).timestamp
        if db_start_time <= input_start_time < db_end_time and user_shift.id is not shift_id:
            return True
        elif db_start_time < input_end_time <= db_end_time and user_shift.id is not shift_id:
            return True
        else:
            return False
