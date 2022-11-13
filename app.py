from flask import Flask, render_template, render_template, request, jsonify

app = Flask(__name__)

# API
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/singing')
def singing():
    return render_template('singing.html')

@app.route('/getmethod/csv')
def get_javascript_data(jsdata):
    return jsdata

@app.route('/postmethod', methods = ['POST'])
def get_post_javascript_data():
    print(request)
    jsdata = request.form["x"]
    print(jsdata)
    return jsdata


@app.route('/listening')
def listening():
    return render_template('listening.html')

@app.route('/report')
def report():
    return render_template('report.html')

if __name__ == "__main__": 
   app.run(debug=True)