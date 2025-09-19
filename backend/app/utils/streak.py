from datetime import date, timedelta

def update_streak(user):
    today = date.today()
    if user.last_login:
        if user.last_login == today - timedelta(days=1):
            # consecutive day login
            user.streak = (user.streak or 0) + 1
        elif user.last_login < today - timedelta(days=1):
            # missed a day
            user.streak = 1
    else:
        # initial login
        user.streak = 1
    
    user.last_login = today
    return user.streak