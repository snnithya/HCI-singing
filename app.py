from flask import Flask, render_template, render_template

app = Flask(__name__)

# API
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/practice')
def practice():
    return render_template('practice.html')


if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)