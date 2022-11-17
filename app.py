from flask import Flask, render_template, render_template, request, jsonify

app = Flask(__name__)

# API
@app.route('/')
def index():
    return render_template('library.html')


if __name__ == "__main__": 
   app.run(debug=True)