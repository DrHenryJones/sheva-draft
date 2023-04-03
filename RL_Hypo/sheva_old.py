from flask import Flask, render_template, request
from flask_apscheduler import APScheduler

# set configuration values
class Config:
    SCHEDULER_API_ENABLED = True

app = Flask(__name__)
app.config.from_object(Config())

# initialize scheduler
scheduler = APScheduler()
# if you don't wanna use a config, you can set options here:
# scheduler.api_enabled = True
scheduler.init_app(app)
scheduler.start()

l = []

@app.route('/', methods=['GET', 'POST'])
def main(name='abc'):
    start = False
    if request.method == 'POST':
        # request.form['action'] == 'start'
        if request.form['action'] == 'start':
            l.append(len(l))
            print('start')
        elif request.form['action'] == 'stop':
            print('stop')
    return render_template('index.html', name='dummy', start=start, l=l)


# interval example
@scheduler.task('interval', id='do_job_1', seconds=10)
def job1():
    l.append(len(l))
    print('Job 1 executed')
