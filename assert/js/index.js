const { Graph } = G6;


// 默认数据
const default_graph_data = {
    nodes: [{
        id: 'demo-node-1',
        style: {
            x: 250,
            y: 250,
            innerHTML: '<div style="border: 1px solid #ddd; padding: 32px; background-color: #f9f9f9;">node 1</div>',
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
let content = default_graph_data;
const graph = new Graph({
    container: 'ID-graph-container',
    data: content,
    node: {
        type: 'html',
        style: {
            size: [100, 50],
        },
    },
    edge: {
        type: "quadratic",
    },
    behaviors: [{
        key: 'zoom-canvas',
        type: 'zoom-canvas',
        sensitivity: 2,
        enable: false,
    }, {
        key: 'drag-canvas',
        type: 'drag-canvas',
        enable: false,
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
                    area: ['500px', '300px'],
                    title: 'Hello layer',
                    shade: 0.6, // 遮罩透明度
                    shadeClose: true, // 点击遮罩区域，关闭弹层
                    maxmin: true, // 允许全屏最小化
                    anim: 0, // 0-6 的动画形式，-1 不开启
                    content: `
                    <div style="padding: 32px;">一个普通的页面层，传入了自定义的 HTML</div>
                    <textarea id="ID-editor"></textarea>
                    <script src="./../js/simplemde.min.js"></script>
                    <script>var simplemde = new SimpleMDE({ element: document.getElementById("ID-editor") });</script>
                    `
                  });  
              });
              return `正在编辑`;
            },
          },
      ],
});

function set_file_content(content) {
    // graph the json content
    graph.setData(content);
    graph.render();
}


graph.render();
