import http.server
import socketserver
import cryptography
import threading

from tkinter import filedialog
import os
import json

import webview


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


# 给pywebview的js调用python的api
class JSApi:
    def __init__(self):
        self.current_file_path = ""
        with open('config.json', 'r') as jsonfile:
            self.config = json.load(jsonfile)
            print(self.config)

    def get_config(self):
        return self.config

    def set_config(self, config):
        self.config = config
        with open('config.json', 'w') as jsonfile:
            json.dump(self.config, jsonfile)
        main_window.evaluate_js('config = pywebview.api.get_config();')

    def open_file(self):
        # 选择文件

        file_path = filedialog.askopenfilename()

        self.current_file_path = file_path
        print(f"选择的文件路径是: {file_path}")

        # read file
        with open(file_path, 'r') as f:
            try:
                content = f.read()
                main_window.evaluate_js(f'content = {content}; editor_functions.set_file_content(content);')
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


# JS api 类结束


def main_window_logic(window):
    print("Nice!, window started")
    main_window.evaluate_js('on_pywebview_ready();')


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
    js_api=JSApi(),
    min_size=(600, 450),
    # frameless=True,
)


# 窗口事件
def on_resized(width, height):
    print(
        'pywebview window is resized. new dimensions are {width} x {height}'.format(
            width=width, height=height
        )
    )
    # 调整html文档大小
    main_window.evaluate_js(f"document.body.width = {width}; document.body.height = {height};")


# 这个窗口大小和html大小是个很神奇的问题，之后去查查
# main_window.events.resized += on_resized

# 启动应用程序窗口
webview.start(main_window_logic, main_window, debug=True, icon="./favicon.ico")

# anything below this line will be executed after program is finished executing
print("quiting")
