const { Graph } = G6;


// 默认数据
const default_graph_data = {
    nodes: [{
        id: 'demo-node-1',
        style: {
            x: 250,
            y: 250,
            innerHTML: '<div style="position: relative; border-width: 1px; border-style: solid; border-radius: 2px; box-shadow: 1px 1px 4px rgb(0 0 0 / 8%); background-color: #fff; color: #5F5F5F; border-color: #eee; padding: 20px">node 1</div>',
        }
    },
    {
        id: 'demo-node-2',
        style: {
            x: 350,
            y: 250,
            innerHTML: '<div style="border: 1px solid #ddd; padding: 32px; background-color: #f9f9f9;">node 2</div>',
        }
    },
    ],
    edges: [{
        source: 'demo-node-1',
        target: 'demo-node-2'
    }],
};

// 初始化数据
const graph = new Graph({
    container: 'ID-graph-container',
    autoResize: true,
    data: default_graph_data,
    node: {
        type: 'html',
        style: {
            // size: [100, 50],
        },
    },
    edge: {
        type: "quadratic",
    },
    behaviors: [{
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
        enable: (event) => event.shiftKey === false,
    }, {
        key: 'create-edge',
        type: 'create-edge',
        enable: (event) => event.shiftKey === true,
    }],
    plugins: [
        {
            type: 'tooltip',
            trigger: "click",
            getContent: (e, itemsss) => {
                let result = `<h4>Custom Content</h4>`;
                itemsss.forEach((item) => {
                    result += `<p>Type: ${item.id}</p>`;
                    layer.open({
                        type: 1, // page 层类型
                        area: ['800px', '500px'],
                        title: 'Hello layer',
                        shade: 0.6, // 遮罩透明度
                        shadeClose: true, // 点击遮罩区域，关闭弹层
                        maxmin: true, // 允许全屏最小化
                        anim: 0, // 0-6 的动画形式，-1 不开启
                        content: edit_node_layer_content(item.id),
                    });
                });
                return `<div>正在编辑</div>`;
            },
        },
    ],
});

function set_file_content(content) {
    // graph the json content
    console.log("set_file_content");
    graph.setData(content);
    graph.render();
}

function get_node_html_with_border(html){
    return `
    <div style="position: relative; border-width: 1px; border-style: solid; border-radius: 2px; box-shadow: 1px 1px 4px rgb(0 0 0 / 8%); background-color: #fff; color: #5F5F5F; border-color: #eee; padding: 20px">${html}</div>
    `
}

function getContainerSize(htmlString) {
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
    return [ width, height ];
}

function edit_node_layer_content(node_id) {
    console.log("edit_node_layer", node_id);
    let node = graph.getNodeData(node_id);
    var turndownService = new TurndownService();
    console.log("node_innerhtml", node.style.innerHTML);
    var markdown = turndownService.turndown(`${node.style.innerHTML}`);
    console.log("markdown", markdown);
    return `
        <div style="padding: 32px;">一个普通的页面层，传入了自定义的 HTML</div>
        <textarea id="ID-editor">${markdown}</textarea>
        <button type="button" class="layui-btn" onclick="save_node_content('${node_id}',simplemde.value())">确定</button>
        <script src="./../js/simplemde.min.js"></script>
        <script>var simplemde = new SimpleMDE({ element: document.getElementById("ID-editor") });</script>
        `
}

function save_node_content(node_id, md) {
    console.log("save_node_content", node_id);
    let html_content = get_node_html_with_border(marked.parse(md));

    console.log("updating html_content");

    let size = getContainerSize(html_content);
    console.log("size", size);

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


console.log("rendering graph");
graph.render();

// 画面

