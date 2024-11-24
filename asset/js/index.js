const {Graph} = G6;


// 数据默认值
const graph_data = {
    nodes: [{
        id: 'demo-node-1',
        style: {
            x: 200,
            y: 200,
            size: [85, 58],
            innerHTML: '<div style="position: relative; border-width: 1px; border-style: solid; border-radius: 2px; box-shadow: 1px 1px 4px rgb(0 0 0 / 8%); background-color: #fff; color: #5F5F5F; border-color: #eee; padding: 20px"><p>node 1</p></div>',
        }
    },
        {
            id: 'demo-node-2',
            style: {
                x: 400,
                y: 200,
                size: [85, 58],
                innerHTML: '<div style="position: relative; border-width: 1px; border-style: solid; border-radius: 2px; box-shadow: 1px 1px 4px rgb(0 0 0 / 8%); background-color: #fff; color: #5F5F5F; border-color: #eee; padding: 20px"><p>node 2</p></div>',
            }
        },
    ],
    edges: [{
        source: 'demo-node-1',
        target: 'demo-node-2'
    }],
};

// 撤销重做功能
// 用于记录状态的栈
const history_stack = []; //undo stack
const redo_stack = [];

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 请每次操作时都执行这个来使更改加入历史记录
function save_graph_state_history() {
    history_stack.push(deepClone(graph.getData())); // 保存当前的深拷贝
    console.log("history saved");
}

// 撤销到上一个状态
function undo() {
    if (history_stack.length > 0) {
        redo_stack.push(deepClone(graph.getData()));
        graph.setData(history_stack.pop()); // 恢复到上一个状态
        graph.render();
        console.log("Undo performed.");
    } else {
        layer.msg('没有更多历史记录了');
        console.log("No more states to undo.");
    }
}

// 重做
function redo() {
    if (redo_stack.length > 0) {
        history_stack.push(deepClone(graph.getData())); // 当前状态存回撤销栈
        graph.setData(redo_stack.pop());
        console.log("Redo performed.");
    } else {
        console.log("No more states to redo.");
    }
}

// 初始化数据
const graph = new Graph({
    container: 'ID-graph-container',
    autoResize: true,
    data: graph_data,
    node: {
        type: 'html',
        style: {
            // size: [100, 50],
        },
    },
    edge: {
        type: "quadratic",
    },
    combo: {
        style: {
            labelText: (d) => d.id,
            labelPadding: [1, 10],
            labelFill: '#fff',
            labelBackground: true,
            labelBackgroundRadius: 4,
            labelBackgroundFill: '#7e3feb',
        },
    },
    layout: {},
    behaviors: [{
        key: 'brush-select',
        type: 'brush-select',
        trigger: ['shift'],
        enableElements: ['node', 'combo'],
        onSelect: (event) => {
            console.log("brush-selected, ready to create combo", event);
            if (isEmptyRecord(event)) {
                return;
            }
            open_add_combo_layer(event);
        },
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
            save_graph_state_history();
        },
        enable: (event) => event.shiftKey === false,
    }, {
        key: 'create-edge',
        type: 'create-edge',
        enable: (event) => event.shiftKey === true,
    }],
    plugins: [
        {
            type: 'contextmenu',
            trigger: 'contextmenu', // 'click' or 'contextmenu'
            getItems: (e) => {
                console.log("targetType", e.targetType);
                console.log("id", e.target.id);

                if (e.targetType === "node") {
                    return [
                        {name: '编辑', value: "edit"},
                        {name: '删除', value: "delete"},
                    ];
                } else if (e.targetType === "edge") {
                    return [
                        {name: '删除边', value: "delete"},
                    ]
                } else if (e.targetType === "combo") {
                    return [
                        //{name: '编辑', value: "edit"},
                        {name: '解除组合', value: "delete"},
                    ]
                } else if (e.targetType === "canvas") {
                    return [
                        {name: '添加节点', value: "add_node"},
                        {name: '自动布局', value: "auto_layout"},
                    ]
                }
                return [];
            },
            onClick: (value, menu_item, e) => {
                console.log("value", value);
                console.log("e.id", e.id);
                console.log("e.type", e.type); // 这个值有三种情况，node，edge和undefined，undefined表示点击空白画布区域
                console.log("e", e);

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
            },
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

function isEmptyRecord(record) {
    // 首先检查对象是否有任何属性
    for (const key in record) {
        // 如果对象有自己的属性（不是从原型链上继承的）
        if (Object.prototype.hasOwnProperty.call(record, key)) {
            // 获取该属性的值
            const value = record[key];

            // 检查值是否是非空字符串或非空数组
            if (typeof value === 'string' && value.trim() !== '') {
                // 如果是非空字符串，则对象不为空
                return false;
            } else if (Array.isArray(value) && value.length > 0) {
                // 如果是非空数组，则对象不为空
                return false;
            }
            // 如果值是空字符串、空数组或未定义（尽管类型定义中未包含undefined，但这里为了健壮性还是检查一下）
            // 则继续检查下一个属性
        }
    }

    // 如果遍历完所有属性都没有发现非空值，则对象为空
    return true;
}

// 主要函数 创建combo
function open_add_combo_layer(event) {
    layer.prompt({title: '请输入组合id'}, function (text, index) {
        layer.close(index);
        save_graph_state_history();
        let combo_id = text;
        graph.addComboData([{id: combo_id, type: 'rect',}]);
        console.log("combo_id", combo_id);
        for (const node_id in event) {
            console.log('This node should be selected', node_id);
            graph.updateNodeData([{id: node_id, combo: combo_id}]);
        }
        graph.render();
    });
}

// 主要函数 获取文件内容
function set_file_content(content) {
    // graph the json content
    console.log("set_file_content");
    graph.setData(content);
    graph.render();
}

// 辅助函数 获得有样式的div
function get_node_html_with_border(html) {
    return `
    <div style="position: relative; border-width: 1px; border-style: solid; border-radius: 2px; box-shadow: 1px 1px 4px rgb(0 0 0 / 8%); background-color: #fff; color: #5F5F5F; border-color: #eee; padding: 20px">${html}</div>
    `
}

// 辅助函数 根据内容获得容器大小
function get_container_size(htmlString) {
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

// 主要函数 打开编辑节点对话框
function open_edit_node_layer(node_id) {
    console.log("edit_node_layer", node_id);

    // 编辑已有节点的情况
    let node = graph.getNodeData(node_id);

    var turndownService = new TurndownService();
    console.log("node_innerhtml", node.style.innerHTML);

    let markdown = turndownService.turndown(`${node.style.innerHTML}`);
    console.log("markdown", markdown);

    let edit_node_layer_content = `
        <div class="layui-input-group">
            <div class="layui-input-prefix">节点id</div>
            <input id="ID-id-edit" type="text" class="layui-input" value="${node_id}" disabled>
        </div>      

        <textarea id="ID-editor">${markdown}</textarea>
        <button type="button" class="layui-btn" onclick="save_node_content('${node_id}', simplemde.value())">确定</button>
        <script src="./../js/simplemde.min.js"></script>
        <script>
            var simplemde = new SimpleMDE({ element: document.getElementById("ID-editor") });
        </script>
        `

    layer.open({
        type: 1, // page 层类型
        area: ['800px', '500px'],
        title: '编辑节点',
        shade: 0.6, // 遮罩透明度
        shadeClose: true, // 点击遮罩区域，关闭弹层
        maxmin: true, // 允许全屏最小化
        anim: 0, // 0-6 的动画形式，-1 不开启
        content: edit_node_layer_content,
    });
}


// 主要函数 保存编辑后的内容
function save_node_content(node_id, md) {

    console.log("save_node_content", node_id);
    let html_content = get_node_html_with_border(marked.parse(md));

    console.log("updating html_content", html_content);

    let size = get_container_size(html_content);
    console.log("size", size);

    save_graph_state_history();

    graph.updateNodeData([{
        id: node_id,
        style: {
            size: size,
            innerHTML: `${html_content}`,
        }
    }]);

    graph.render();
    layer.closeLast();
}

// 这个功能目前没什么用，因为现在的graph是纯为innerHtml设计的，别的图都用不了
function import_data_from_web() {
    layer.prompt({title: '请输入数据链接',}, function (text, index) {
        layer.close(index);
        fetch(text).then((res) => res.json()).then((data) => {
            graph.setData(data);
            graph.render();
        });
    });
}

// 下拉菜单
function node_dropdown_menu(operation, e) {
    console.log("node_dropdown_menu", operation);
    if (operation === "edit") {
        // 严谨来说应该在编辑窗口的回调函数里调用save_graph_state_history();
        open_edit_node_layer(e.id);
    } else if (operation === "delete") {
        save_graph_state_history();
        graph.removeNodeData([e.id]);
        graph.render();
    }

}

function edge_dropdown_menu(operation, e) {
    console.log("edge_dropdown_menu", operation);
    if (operation === "delete") {
        save_graph_state_history();
        graph.removeEdgeData([e.id]);
        graph.render();
    }
}

function combo_dropdown_menu(operation, e) {
    console.log("combo_dropdown_menu", operation);
    if (operation === "delete") {
        save_graph_state_history();
        graph.removeComboData([e.id]);
        graph.render();
    }
}

function canvas_dropdown_menu(operation, e) {
    console.log("canvas_dropdown_menu", operation);
    console.log(e);
    if (operation === "add_node") {
        layer.prompt({title: '请输入新节点id',}, function (text, index) {
            layer.close(index);
            save_graph_state_history();
            graph.addNodeData([{id: text, style: {x: context_menu_position[0], y: context_menu_position[1]}}]);
            open_edit_node_layer(text);
        });
    } else if (operation === "auto_layout") {
        save_graph_state_history();
        graph.setLayout({type: 'dagre',});
        graph.render();
    }
}

// main
console.log("rendering graph");
graph.render();