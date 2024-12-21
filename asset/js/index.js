const { Graph } = G6;

//import { jsPDF } from "jspdf";

//生成节点id
const generate_node_id = (function () {
    let n = 2; // 使用闭包变量
    return function () {
        return "n" + n++;
    };
})();

// 数据默认值
const graph_data = {
    nodes: [{
        id: 'n0',
        style: {
            x: 200,
            y: 200,
            size: [100, 58],
            innerHTML: '<div style="position: relative; border-width: 1px; border-style: solid; border-radius: 2px; box-shadow: 1px 1px 4px rgb(0 0 0 / 8%); background-image: linear-gradient(to bottom, #16baaa 5px, #fff 5px); color: #5F5F5F; border-color: #eee; padding: 25px"><p>node 1</p></div>',
        }
    },
    {
        id: 'n1',
        style: {
            x: 400,
            y: 200,
            size: [100, 58],
            innerHTML: '<div style="position: relative; border-width: 1px; border-style: solid; border-radius: 2px; box-shadow: 1px 1px 4px rgb(0 0 0 / 8%); background-image: linear-gradient(to bottom, #16baaa 5px, #fff 5px); color: #5F5F5F; border-color: #eee; padding: 25px"><p>node 2</p></div>',
        }
    },
    ],
    edges: [{
        source: 'n0',
        target: 'n1'
    }],
};

// 初始化图数据 和一些样式
const graph = new Graph({
    container: 'ID-graph-container',
    autoResize: true,
    data: graph_data,
    node: {
        type: 'html',
        style: {
            // size: [100, 50],
            badge: false,
        },
        state: {
            selected: {
                //size: [205, 60],
                halo: false, //有显示bug
                badge: true,
                badges: [
                    { text: "√", placement: "top-right" }
                ],
                badgeFontSize: 12,
            },
        }
    },
    edge: {
        type: "quadratic",
        style: {
            lineWidth: 1,
            labelPadding: [1, 10],
            labelFill: '#fff',
            labelBackground: true,
            labelBackgroundRadius: 4,
            labelBackgroundFill: '#16b777',
        }
    },
    combo: {
        style: {
            //labelText: "combo", //这个地方覆盖了之后就改不了了
            labelPadding: [1, 10],
            labelFill: '#fff',
            labelBackground: true,
            labelBackgroundRadius: 4,
            labelBackgroundFill: '#7e3feb',
        },
    },
    layout: {
        // layout: 'force',
    },
    behaviors: [{
        key: 'click-select',
        type: 'click-select',
        state: 'selected',
        multiple: true,
        //trigger: 'ctrl',
        onClick: (event) => {
            if (event.target.type === undefined) {
                return;
            }
            console.log("click-select", event);
            console.log("stated nodes", graph.getElementDataByState('node', 'selected'));
        },
    }, {
        key: 'brush-select',
        type: 'brush-select',
        immediately: false,
        mode: 'default',
        state: 'selected',
        trigger: ['shift'],
        enableElements: ['node', 'combo', 'edge'],
        // onSelect: (event) => {
        // //最好保持注释，要不然会有bug，改变的state只有一瞬间
        // },
        enable: (event) => event.shiftKey === true,
    }, {
        key: 'zoom-canvas',
        type: 'zoom-canvas',
        sensitivity: 0.5,
        enable: true,
    }, {
        key: 'drag-canvas',
        type: 'drag-canvas',
        enable: (event) => event.ctrlKey === true,
    }, {
        key: 'drag-element',
        type: 'drag-element',
        onFinish: (ids) => {
            //save_graph_state_history();
        },
        enable: (event) => event.shiftKey === false,
    }, {
        key: 'create-edge',
        type: 'create-edge',
        //enable: (event) => event.shiftKey === true,
        enable: false,
    }],
    plugins: [
        {
            type: 'contextmenu',
            trigger: 'contextmenu', // 'click' or 'contextmenu'
            getItems: (e) => {
                console.log("targetType", e.targetType);
                console.log("id", e.target.id);

                let items = [];

                if (e.targetType === "node") {
                    let selected_nodes = graph.getElementDataByState('node', 'selected');

                    items.push({ name: 'Edit node', value: "edit" });
                    items.push({ name: 'Delete node', value: "delete" });

                    if (selected_nodes.length > 1) {
                        items.push({ name: 'Create combo', value: "add_combo" });
                    }
                    if (selected_nodes.length === 2) {
                        items.push({ name: 'Create edge', value: "create_edge" });
                    }

                } else if (e.targetType === "edge") {
                    items.push({ name: 'Edit label', value: "edit" });
                    items.push({ name: 'Remove edge', value: "delete" });

                } else if (e.targetType === "combo") {
                    items.push({ name: 'Edit label', value: "edit" });
                    items.push({ name: 'Remove combo', value: "delete" });

                } else if (e.targetType === "canvas") {
                    items.push({ name: 'Add node', value: "add_node" });
                    items.push({ name: 'Auto layout', value: "auto_layout" });
                }
                if (graph.getElementDataByState('node', 'selected').length > 0) {
                    items.push({ name: 'Remove selection', value: "delete_selected" });
                }
                if (graph.getElementDataByState('edge', 'selected').length > 0) {
                    items.push({ name: 'Remove all edges', value: "delete_selected_edges" });
                }

                items.sort((a, b) => {
                    // 提取每个对象的 name 属性的首字母
                    const nameA = a.name.charAt(0).toLowerCase();
                    const nameB = b.name.charAt(0).toLowerCase();

                    // 进行比较并返回结果
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                return items;
            },
            onClick: on_dropdown_menu_click,
            enable: true,

        }
    ],
});

// G6的事件没有位置信息，只能自己写了
let context_menu_position = [0, 0];
let graph_div = document.getElementById("ID-graph-container");
graph_div.addEventListener('contextmenu', function (event) {
    context_menu_position = [event.clientX, event.clientY];
})

/* 考虑快捷键设计好之后给鼠标对graph的操作加上历史记录
let isDragging = false; // 标志是否正在拖动
let startX = 0; // 起始位置
let startY = 0;

document.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // 检测是否为左键
        isDragging = true;
        startX = event.clientX; // 记录起始位置
        startY = event.clientY;
        console.log(`Drag started at (${startX}, ${startY})`);
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        console.log("Drag ended");
    }
});
*/

// function isEmptyRecord(record) {
//     // 首先检查对象是否有任何属性
//     for (const key in record) {
//         // 如果对象有自己的属性（不是从原型链上继承的）
//         if (Object.prototype.hasOwnProperty.call(record, key)) {
//             // 获取该属性的值
//             const value = record[key];

//             // 检查值是否是非空字符串或非空数组
//             if (typeof value === 'string' && value.trim() !== '') {
//                 // 如果是非空字符串，则对象不为空
//                 return false;
//             } else if (Array.isArray(value) && value.length > 0) {
//                 // 如果是非空数组，则对象不为空
//                 return false;
//             }
//             // 如果值是空字符串、空数组或未定义（尽管类型定义中未包含undefined，但这里为了健壮性还是检查一下）
//             // 则继续检查下一个属性
//         }
//     }

//     // 如果遍历完所有属性都没有发现非空值，则对象为空
//     return true;
// }


class EditorFunctions {

    #history_stack;
    #redo_stack;

    constructor() {
        // 撤销重做功能
        // 用于记录状态的栈
        this.#history_stack = []; //undo stack
        this.#redo_stack = [];
    }

    #deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // 请每次操作时都执行这个来使更改加入历史记录
    save_graph_state_history() {
        this.#history_stack.push(this.#deepClone(graph.getData())); // 保存当前的深拷贝
        console.log("history saved", this.#history_stack);
    }

    // 撤销到上一个状态
    undo() {
        if (this.#history_stack.length > 0) {
            this.#redo_stack.push(this.#deepClone(graph.getData()));
            graph.setData(this.#history_stack.pop()); // 恢复到上一个状态
            graph.render();

            console.log("Undo performed.");
            console.log("history stack:", this.#history_stack);
            console.log("redo stack:", this.#redo_stack);
        } else {
            layer.msg('No more history');
            console.log("No more states to undo.");
        }
    }

    // 重做
    redo() {
        if (this.#redo_stack.length > 0) {
            this.#history_stack.push(this.#deepClone(graph.getData())); // 当前状态存回撤销栈
            graph.setData(this.#redo_stack.pop());
            graph.render();

            console.log("Redo performed.");
            console.log("history stack:", this.#history_stack);
            console.log("redo stack:", this.#redo_stack);
        } else {
            layer.msg('No more history');
            console.log("No more states to redo.");
        }
    }

    // 打印/导出
    print() {
        console.log("print");

    }

    // 主要函数 获取文件内容
    set_file_content(content) {
        // graph the json content
        console.log("editor_functions.set_file_content");
        graph.setData(content);
        graph.render();
    }

    // 这个功能目前没什么用，因为现在的graph是纯为innerHtml设计的，别的图都用不了
    import_data_from_web() {
        layer.prompt({ title: 'Enter data url', }, function (text, index) {
            layer.close(index);
            fetch(text).then((res) => res.json()).then((data) => {
                graph.setData(data);
                graph.render();
            });
        });
    }
}
let editor_functions = new EditorFunctions();


class AppFunctions {
    constructor() { }

    open_edit_node_layer(node_id) {
        console.log("edit_node_layer", node_id);

        let node_data = graph.getNodeData(node_id);
        let markdown = node_data.data.markdown;
        if (markdown === undefined) markdown = "";

        console.log("markdown", markdown);

        // 构造弹窗
        let edit_node_layer_content = `
            <div class="layui-input-group">
                <div class="layui-input-prefix">Node id</div>
                <input id="ID-id-edit" type="text" class="layui-input" value="${node_id}" disabled>
            </div>      
    
            <textarea id="ID-editor">${markdown}</textarea>
            <button type="button" class="layui-btn" onclick="graph_functions.save_node_content('${node_id}', simplemde.value())">Save</button>
            <script src="./../js/simplemde.min.js"></script>
            <script>
                var simplemde = new SimpleMDE({ element: document.getElementById("ID-editor") });
            </script>
            `

        layer.open({
            type: 1, // page 层类型
            area: ['800px', '500px'],
            title: 'Edit node',
            shade: 0.6, // 遮罩透明度
            shadeClose: true, // 点击遮罩区域，关闭弹层
            maxmin: true, // 允许全屏最小化
            anim: 0, // 0-6 的动画形式，-1 不开启
            content: edit_node_layer_content,
        });
    }

    open_edit_edge_layer(edge_id) {
        console.log("open_edit_edge_layer edge_id", edge_id);
        layer.prompt({ title: 'Enter label', }, function (text, index) {
            layer.close(index);
            editor_functions.save_graph_state_history();
            graph.updateEdgeData([{ id: edge_id, style: { labelText: text } }]);

            graph.render();
        });
    }

    open_edit_combo_layer(combo_id) {
        console.log("open_edit_combo_layer combo_id", combo_id);
        layer.prompt({ title: 'Enter label', }, function (text, index) {
            layer.close(index);
            editor_functions.save_graph_state_history();
            graph.updateComboData([{ id: combo_id, style: { labelText: text } }]);

            graph.render();
        });
    }

    // 主要函数 创建combo
    open_add_combo_layer(ids) {
        console.log("ids", ids);
        // 现在combo会把首次输入的标签作为id之后可以改
        layer.prompt({ title: 'Enter Combo Name' }, function (text, index) {
            layer.close(index);
            editor_functions.save_graph_state_history();
            let combo_id = text;
            graph.addComboData([{ id: combo_id, type: 'rect', style: { labelText: combo_id } }]);
            console.log("combo_id", combo_id);
            ids.forEach(node_id => {
                console.log('This node should be selected', node_id);
                graph.updateNodeData([{ id: node_id, combo: combo_id }]);
            });
            graph.render();
        });
    }

    #get_settings_layer() {
        return `
        <div class="layui-tab layui-tab-brief">
            <ul class="layui-tab-title">
                <li class="layui-this">General</li>
                <li>标签2</li>
                <li>标签3</li>
                <li>标签4</li>
                <li>标签5</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <div class="layui-input-group">
                        <div class="layui-input-prefix">Manual Input id</div>
                        <input type="checkbox" name="BBB" title="ON|OFF" lay-skin="switch" checked> 
                    </div>
                </div>
                <div class="layui-tab-item">内容-2</div>
                <div class="layui-tab-item">内容-3</div>
                <div class="layui-tab-item">内容-4</div>
                <div class="layui-tab-item">内容-5</div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button type="button" class="layui-btn">Save&Apply</button> 
            <button type="button" class="layui-btn layui-btn-primary">Cancel</button> 
        </div>
        `
    }

    open_settings() {
        console.log("open_settings");

        layer.open({
            type: 1, // page 层类型
            area: ['800px', '500px'],
            title: 'Settings',
            shade: 0.2, // 遮罩透明度
            shadeClose: true, // 点击遮罩区域，关闭弹层
            anim: 0, // 0-6 的动画形式，-1 不开启
            content: this.#get_settings_layer(),
        });
    }

} // AppFunctions
let app_functions = new AppFunctions();

/*
// 对非 ASCII 字符编码
function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// 解码 Base64 到非 ASCII 字符
function base64ToUtf8(base64) {
    return decodeURIComponent(escape(atob(base64)));
}
*/

// 辅助函数 有关渲染的工序
function render_md_content(md) {
    // 创建一个自定义渲染器，继承自默认的渲染器
    const customRenderer = new marked.Renderer();

    //覆盖默认的 image 方法 此处函数的参数是一个img对象，需要用{}解包
    customRenderer.image = function ({ href, text }) {
        console.log("img", href, text);
        // 构造包含 CSS 类的 <img> 标签
        // 如果需要，可以添加一个包裹 <img> 标签的 <div> 或其他元素，并添加样式
        // 例如：return `<div class="image-container">${imgTag}</div>`;
        return `<img src="${href}" alt="${text}" style="max-width: 100%; height: auto; margin: 5px;" />`;
    };

    // 覆盖默认的 link 方法
    customRenderer.link = function (href, title, text) {
        const base = marked.Renderer.prototype.link.call(this, href, title, text);
        // 在 <a> 标签上添加 target="_blank" 和 rel="noopener noreferrer"
        return base.replace(/^<a\s/, '<a target="_blank" rel="noopener noreferrer" ');
    };

    let html_content = marked.parse(md, { renderer: customRenderer });

    console.log("updating html_content", html_content);
    return html_content;
}


// 功能
class GraphFunctions {
    constructor() { }

    delete_selected() {
        console.log("delete_selected");
        let selected_nodes = graph.getElementDataByState('node', 'selected');
        let selected_node_ids = [];
        let selected_combos = graph.getElementDataByState('combo', 'selected');
        let selected_combo_ids = [];

        editor_functions.save_graph_state_history();

        selected_nodes.forEach((item) => {
            selected_node_ids.push(item.id);
        });
        graph.removeNodeData(selected_node_ids);

        selected_combos.forEach((item) => {
            selected_combo_ids.push(item.id);
        });
        graph.removeComboData(selected_combo_ids);

        graph.render();
    }

    delete_selected_edges() {
        let selected_edges = graph.getElementDataByState('edge', 'selected');
        let selected_edge_ids = [];

        selected_edges.forEach((item) => {
            selected_edge_ids.push(item.id);
        });
        editor_functions.save_graph_state_history();
        graph.removeEdgeData(selected_edge_ids);

        graph.render();
    }

    delete_node(node_id) {
        editor_functions.save_graph_state_history();
        graph.removeNodeData([node_id]);
        graph.render();
    }

    delete_edge(edge_id) {
        editor_functions.save_graph_state_history();
        graph.removeEdgeData([edge_id]);
        graph.render();
    }

    combo_selected() {
        let selected_nodes = graph.getElementDataByState("node", "selected");
        console.log("selected_nodes", selected_nodes);
        let node_ids = [];
        selected_nodes.forEach(node => {
            node_ids.push(node.id);
        });
        app_functions.open_add_combo_layer(node_ids);
    }

    add_node() {
        if (config["General"]["doManualInputId"] === true) {
            layer.prompt({ title: 'Enter node id', }, function (text, index) {
                layer.close(index);
                graph.addNodeData([{
                    id: text,
                    style: { x: context_menu_position[0], y: context_menu_position[1] - 100, innerHTML: "" }
                }]);
                //editor_functions.save_graph_state_history();下方函数有一次了
                graph_functions.save_node_content(text, "");
            });
        } else {
            let node_id = generate_node_id();
            editor_functions.save_graph_state_history();
            graph.addNodeData([{
                id: node_id,
                style: { x: context_menu_position[0], y: context_menu_position[1] - 100, innerHTML: "" }
            }]);
            graph_functions.save_node_content(node_id, "");

        }
    }

    // 主要函数 保存编辑后的内容
    save_node_content(node_id, md) {
        console.log("graph_functions.save_node_content", node_id);

        let html_content = this.#get_node_html_with_border(render_md_content(md));

        let size = this.#get_container_size(html_content);
        console.log("size", size);

        editor_functions.save_graph_state_history();

        graph.updateNodeData([{
            id: node_id,
            style: {
                size: size,
                innerHTML: `${html_content}`,
            },
            data: {
                markdown: md,
            }
        }]);

        graph.render();
        layer.closeLast();
    }

    // 辅助函数 获得有样式的div
    #get_node_html_with_border(html) {
        return `
        <div style="position: relative; border-width: 1px; border-style: solid; border-radius: 2px; box-shadow: 1px 1px 4px rgb(0 0 0 / 8%); background-image: linear-gradient(to bottom, #16baaa 5px, #fff 5px); color: #5F5F5F; border-color: #eee; padding: 25px">${html}</div>
        `
    }

    // 辅助函数 根据内容获得容器大小// 辅助函数 根据内容获得容器大小
    #get_container_size(htmlString) {
        // 创建一个隐藏的容器来渲染用户输入的 HTML
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.visibility = 'hidden';
        container.style.width = 'auto';
        container.style.height = 'auto';
        container.innerHTML = htmlString;

        // 将容器添加到文档中
        document.body.appendChild(container);

        // 获取容器的宽度和高度
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        // 移除临时容器
        document.body.removeChild(container);

        // 返回宽度和高度
        return [width, height];
    }
}

let graph_functions = new GraphFunctions();

// 下拉菜单操作
function on_dropdown_menu_click(value, menu_item = null, e = null) {
    console.log("on_dropdown_menu_click", value);
    console.log("e.type", e.type); // 这个值有三种情况，node，edge和undefined，undefined表示点击空白画布区域

    if (general_dropdown_menu(value) === false) {
        if (e === null) {
            return;
        } //有些时候直接调用函数没有后俩参数
        switch (e.type) {
            case "node":
                node_dropdown_menu(value, e);
                break;
            case "edge":
                edge_dropdown_menu(value, e);
                break;
            case "combo":
                combo_dropdown_menu(value, e);
                break;
            case undefined:
                canvas_dropdown_menu(value, e);
                break;
            default:
                console.log("unknown e.type");
                break;
        }
    }
}

function general_dropdown_menu(operation) {
    if (operation === "delete_selected") {
        graph_functions.delete_selected();
    } else if (operation === "delete_selected_edges") {
        graph_functions.delete_selected_edges();
    } else {
        return false;
    }
    return true;
}

function node_dropdown_menu(operation, e) {
    console.log("node_dropdown_menu", operation);
    if (operation === "edit") {
        // 严谨来说应该在编辑窗口的回调函数里调用editor_functions.save_graph_state_history();
        app_functions.open_edit_node_layer(e.id);
    } else if (operation === "delete") {
        graph_functions.delete_node(e.id);
    } else if (operation === "add_combo") {
        graph_functions.combo_selected();
    } else if (operation === "create_edge") {
        let selected_nodes = graph.getElementDataByState("node", "selected");
        console.log("selected_nodes", selected_nodes);
        if (selected_nodes.length !== 2) {
            layer.msg("Please select two nodes");
            return;
        }
        editor_functions.save_graph_state_history();
        graph.addEdgeData([{ source: selected_nodes[0].id, target: selected_nodes[1].id }]);
        graph.render();
    }

}

function edge_dropdown_menu(operation, e) {
    console.log("edge_dropdown_menu", operation);
    if (operation === "delete") {
        graph_functions.delete_edge(e.id);
    } else if (operation === "edit") {
        app_functions.open_edit_edge_layer(e.id);
    }
}

function combo_dropdown_menu(operation, e) {
    console.log("combo_dropdown_menu", operation);
    if (operation === "delete") {
        editor_functions.save_graph_state_history();
        graph.removeComboData([e.id]);
        graph.render();
    } else if (operation === "edit") {
        app_functions.open_edit_combo_layer(e.id);
    }
}

function canvas_dropdown_menu(operation, e) {
    console.log("canvas_dropdown_menu", operation);
    //我指望从e里获得下拉菜单或者鼠标的位置，但是好像没有
    console.log(e);

    if (operation === "add_node") {
        graph_functions.add_node();
    } else if (operation === "auto_layout") {
        //editor_functions.save_graph_state_history();
        graph.setLayout({ type: 'dendrogram', direction: "TB", nodeStep: 40 });
        graph.render();
    }
}

// 键盘快捷键处理
document.addEventListener("keydown", function (e) {
    console.log("keydown", e.key);
    let selected_nodes = graph.getElementDataByState("node", "selected");
    let IsSelectedNode = selected_nodes.length > 0;

    if (e.ctrlKey) {

    } else if (e.altKey) {

    } else if (e.shiftKey) {

    } else { //没有按下shift或ctrl
        // 现有一映射表maps，一值e.key，如果在maps的值里找不到key，那么返回，如果找到了，那么根据键进行操作
        let maps = config.KeyBoardShortCuts.None;
        console.log("maps", maps);
        // 检查映射表中是否有这个键
        if (maps.hasOwnProperty(e.key)) {
            let action = maps[e.key];
            switch (action) {
                case "add_node":
                    graph_functions.add_node();
                    break;
                case "delete_selected":
                    graph_functions.delete_selected();
                    break;
                default:
                    return false;
            }
        } else { // 没有找到键
            return false;
        }
    }

    // 什么都没有就按原来方法处理事件
    return false;
});

// main
console.log("rendering graph");
graph.render();

let config = {}
// 有点逆天，但是pywebview的接口要等一会才会加载出来
// 被python调用
function on_pywebview_ready() {
    pywebview.api.get_config().then((conf) => {
        console.log("config", conf);
        config = conf;
    })
}