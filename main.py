import webview
import http.server
import socketserver
import threading

def main_window_logic(window):
    print("Nice!, window started")


PORT = 8000
# 创建 HTTP 服务器线程
def start_server():
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()


def readFile(file_path):
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



# 启动本地服务器线程
server_thread = threading.Thread(target=start_server)
server_thread.daemon = True
server_thread.start()

# 启动应用程序窗口
main_window = webview.create_window('webplot', url=f'http://localhost:{PORT}/assert/html/index.html')
webview.start(main_window_logic, main_window)

# anything below this line will be executed after program is finished executing
print("quiting")