from flask import Flask, render_template, render_template, request, jsonify

app = Flask(__name__)

singing_data = {
    "x": [],
    "y": []
}
# API
@app.route('/')
def index():
    return render_template('library.html')

@app.route('/demo0')
def demo0():
    return render_template('demo0.html')

@app.route('/demo1')
def demo1():
    return render_template('demo1.html')

@app.route('/demo2')
def demo2():
    return render_template('demo2.html')

@app.route('/demo3')
def demo3():
    return render_template('demo3.html')

@app.route('/demo4')
def demo4():
    return render_template('demo4.html')

@app.route('/demo5')
def demo5():
    return render_template('demo5.html')

@app.route('/singing')
def singing():
    return render_template('singing.html')

@app.route('/getmethod')
def get_javascript_data():
    return singing_data

@app.route('/postmethod', methods = ['POST'])
def get_post_javascript_data():
    global singing_data
    singing_data = request.json
    return singing_data


@app.route('/listening')
def listening():
    return render_template('listening.html')

@app.route('/report')
def report():
    return render_template('report.html')

if __name__ == "__main__": 
   app.run(debug=True)