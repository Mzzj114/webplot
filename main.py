import http.server
import socketserver
import threading
import tkinter as tk
from tkinter import filedialog
import os
import json

import webview


# 给pywebview的js调用python的api
class JSApi:
    current_file_path = ""

    def open_file(self):
        # 选择文件

        file_path = filedialog.askopenfilename()

        self.current_file_path = file_path
        print(f"选择的文件路径是: {file_path}")

        # read file
        with open(file_path, 'r') as f:
            try:
                content = f.read()
                main_window.evaluate_js(f'content = {content}; set_file_content(content);')
            except Exception as e:
                print(e)
                main_window.evaluate_js(f"alert('Error occurred when opening file');")
        main_window.evaluate_js(f"layer.msg('成功打开{file_path}');")

    def save_file(self):
        print("save file")

        if not os.path.exists(self.current_file_path):
            print("file doesn't exist")
            self.save_file_as()
            return

        # js匿名函数
        content = main_window.evaluate_js('graph.getData()')

        with open(self.current_file_path, 'w') as f:
            # indent是缩进，可能出于性能考虑不用缩进
            json.dump(content, f, indent=4)

        main_window.evaluate_js(f"layer.msg('文件保存成功');")

    def save_file_as(self):

        file_path = filedialog.asksaveasfilename()

        if not os.path.exists(file_path):
            return
        print(f"保存文件路径是: {file_path}")
        with open(file_path, 'w') as f:
            content = main_window.evaluate_js('graph.getData()')
            # indent是缩进，可能出于性能考虑不用缩进
            json.dump(content, f, indent=4)
        main_window.evaluate_js(f"layer.msg('文件另存成功');")

    def close_window(self):
        main_window.destroy()


def read_file(file_path):
    # 打开文件并读取内容
    content = ''
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            # print(content)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except IOError:
        print(f"Error: An error occurred while reading the file '{file_path}'.")

    return content


def main_window_logic(window):
    print("Nice!, window started")


# 构建给app的HTTP本地服务器
PORT = 8000
index_url = f'http://localhost:{PORT}/asset/html/index.html'


def start_server():
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()


# 启动本地服务器线程
server_thread = threading.Thread(target=start_server)
server_thread.daemon = True
server_thread.start()

# 创建应用程序窗口
main_window = webview.create_window(
    width=900,
    height=635,
    title='webplot',
    url=index_url,
    js_api=JSApi()
)

# 窗口事件
def on_resized(width, height):
    print(
        'pywebview window is resized. new dimensions are {width} x {height}'.format(
            width=width, height=height
        )
    )
    main_window.evaluate_js(f'graph.setSize({width}, {height});')


# main_window.events.resized += on_resized

# 启动应用程序窗口
webview.start(main_window_logic, main_window, debug=True)

# anything below this line will be executed after program is finished executing
print("quiting")

