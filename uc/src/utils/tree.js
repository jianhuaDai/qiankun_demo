 // optnode 话术节点 //sel 回答节点  // isSelection判断是否回答节点
import {
  uuid
} from "@/utils/obj.js"

const NODE_WIDTH = 100;
const NODE_HEIGHT = 34;
const MARGIN_TOP = 20;
const MARGIN_LEFT = 20;
const SEL_PREFIX = "sel_";
const OPT_PREFIX = "opt_";

// 粘贴板内容转换成node对象
export function copyJsonToNode(json) {
  if (!json) {
    return null;
  }
  let jsonObj = JSON.parse(json);
  let _eachNode = function(node, parent) {
    node.parent = parent;
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => _eachNode(child, node))
    }
  }
  _eachNode(jsonObj);
  return jsonObj;
}

// 复制时node转换成json
export function copyNodeToJson(node) {
  let copyNode = null;
  let _eachNode = function(node, parent) {
    let newNode = {
      id: node.id,
      name: node.name,
      data: node.data ? JSON.parse(JSON.stringify(node.data)) : Object.create(null),
      children: [],
    };
    if (isSelection(node.id)) {
      newNode.type = node.type;
      newNode.jump = node.jump;
    }
    if (copyNode == null) {
      copyNode = newNode;
    }
    if (parent) {
      parent.children.push(newNode)
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(sel => _eachNode(sel, newNode))
    }
  }
  _eachNode(node);
  return copyNode ? JSON.stringify(copyNode) : "";
}

// 克隆当前节点
export function cloneNode(node) {
  let cloneNode = null;
  let _eachNode = function(node, parent) {
    let newNode = {
      id: node.id,
      name: node.name,
      data: node.data ? JSON.parse(JSON.stringify(node.data)) : Object.create(null),
      parent: parent,
      children: [],
    };
    if (isSelection(node.id)) {
      newNode.type = node.type;
      newNode.jump = node.jump;
    }
    if (cloneNode == null) {
      cloneNode = newNode;
    }
    if (parent) {
      parent.children.push(newNode)
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(sel => _eachNode(sel, newNode))
    }
  }
  _eachNode(node);
  return cloneNode;
}

export function getNodeById(tree, nodeId) {
  let ret = null,
    _eachNode = function(node) {
      if (node.id == nodeId) {
        ret = node;
        return;
      }
      if (node.children && node.children.length > 0) {
        node.children.forEach(n => _eachNode(n))
      }
    }
  _eachNode(tree);
  return ret;
}

// 粘贴时 重新更新id
export function resetNodeId(node, nodeList) {
  let _eachNode = function(node) {
    if (nodeList.indexOf(node.id) >= 0) {
      node.id = isSelection(node.id) ? getSelUUID() : getOptUUID();
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(sel => _eachNode(sel))
    }
  }
  _eachNode(node)
}


//解析nodeContent，获取节点数据信息
// 数组结构 每个节点对应一个data对象 
function parseNodeJson(nodeJson) {
  let dataList = [];
  // 话术节点数据
  nodeJson.forEach(json => {
    let data = {
      id: json.id,
      name: json.name || "",
      interfaceCode: json.interfaceCode || "",
      kbId: json.kbId || "",
      sms: json.sms || "",
      intelligenceMatch: json.intelligenceMatch != null ? json.intelligenceMatch : 0,
      intention: json.intention || "",
      artificialAssist: json.artificialAssist || "",
      operations: json.operations
    }
    dataList.push(data);
    // 回答节点数据
    if (json.selections && json.selections.length > 0) {
      json.selections.forEach(sel => {
        dataList.push({
          id: sel.id,
          rule: sel.rule,
          type: sel.type,
          count: sel.count || 2,
          labels: sel.labels || [],
          // 下面数据从treecontent获取
          refNodeId: "",
          flowId: '',
          jumpMode: '',
          retPosition: '',
          retSelection: '',
          
        })
      })
    }
  })
  return dataList;
}

// treeContent和nodeContent 转换成tree对象
export function jsonToTree(json, nodeJson) {
  if (!json) {
    return null;
  }
  let tree = null;
  let dataList = parseNodeJson(nodeJson);
  let _eachNode = function(node, parent) {
    let data = dataList.find(item => item.id == node.id);
    let newNode = {
      id: node.id,
      name: node.name,
      fold: node.fold || false,
      data: data,
      parent: parent,
      children: []
    };
    //sel节点
    if (isSelection(node.id)) {
      newNode.type = node.type;
      newNode.jump = node.next ? (node.next.jump || false) : false;
      if (newNode.jump) {
        data.refNodeId = node.next.id;
        data.flowId = node.next.flowId;
        data.jumpMode = node.next.jumpMode;
        data.retPosition = node.next.retPosition;
        data.retSelection = node.next.retSelection;
        //节点跳转
        if(!data.jumpMode && data.refNodeId){
          data.jumpMode = "node"
        }
      }
    }
    if (tree == null) {
      tree = newNode;
    }
    if (parent) {
      parent.children.push(newNode)
    }
    if (node.nextRelations && node.nextRelations.length > 0) {
      node.nextRelations.forEach(sel => _eachNode(sel, newNode))
    } else if (node.next && !node.next.jump) {
      _eachNode(node.next, newNode)
    }
  }
  _eachNode(json);
  return tree;
}

function canAddChild(node) {
  //1、挂机节点不能添加子节点
  if (isOperation(node.id) && node.data && node.data.operations.find(opt => opt.type == OPT_ACTION.HANGUP) != null) {
    return false;
  }
  //2、已有子节点的回答节点不能添加子节点
  if (isSelection(node.id) && node.children.length > 0) {
    return false;
  }
  return true;
}

function canDelSelf(node) {
  //1、首节点不能删除
  if (node.parent == null) {
    return false;
  }
  return true;
}

// tree对象转换成list渲染
export function treeToList(tree, groupList) {
  if (!tree) {
    return [];
  }
  let treeList = [],
    levelArr = [],
    leafNodeCount = 0; //叶子节点个数
  let _eachNode = function(node, parent) {
    //所属层级
    let level = parent && parent.level != null ? (parent.level + 1) : 0;
    //保存parent、children的引用，方便后续判断处理
    let newNode = {
      type: node.type,
      id: node.id,
      name: node.name,
      fold: node.fold,
      level: level,
      parent: parent,
      children: [],
      flowId: node.flowId,
      jumpMode: node.jumpMode,
      retPosition: node.retPosition,
      retSelection: node.retSelection,
      add: canAddChild(node),
      delete: canDelSelf(node),
      error: checkNodeError(node, tree, groupList)
    };
    if (parent) {
      parent.children.push(newNode)
    }
    //叶子节点能直接计算出位置
    if (node.children.length == 0 || node.fold) {
      newNode.y = NODE_HEIGHT * level + MARGIN_TOP * level;
      newNode.x = NODE_WIDTH * leafNodeCount + MARGIN_LEFT * leafNodeCount;
      leafNodeCount++;
    }

    treeList.push(newNode)

    levelArr[level] = levelArr[level] || [];
    levelArr[level].push(newNode);

    if (node.children && node.children.length > 0 && !node.fold) {
      node.children.forEach(sel => _eachNode(sel, newNode))
    }
  }

  let _getPosX = function(nodeId, nextArr) {
    let firstChild = null,
      lastChild = null;
    for (let node of nextArr) {
      if (node.parent.id != nodeId) {
        continue;
      }
      if (firstChild === null) {
        firstChild = node;
      }
      lastChild = node;
    }
    return (firstChild.x + lastChild.x) / 2;
  }

  let _calcNodePos = function() {
    for (let len = levelArr.length, i = len - 2; i >= 0; i--) {
      levelArr[i].forEach(n => {
        if (n.x == null || n.y == null) {
          n.y = NODE_HEIGHT * n.level + MARGIN_TOP * n.level;
          //根据下一层所有子节点的位置然后放中间
          n.x = _getPosX(n.id, levelArr[i + 1])
        }
      })
    }
  }
  _eachNode(tree);
  _calcNodePos();
  return treeList;
}

export function getConnList(treeList) {
  if (!treeList) {
    return [];
  }
  let connList = [];
  treeList.forEach(node => {
    if (!node.fold) {
      node.children.forEach(child => {
        connList.push({
          source: node.id,
          target: child.id
        });
      })
    }
  })
  return connList;
}

let _line = null;
export function drawLines(container, connList) {
  let _init = function() {
    return new Promise((resolve) => {
      if (_line) {
        _line.unbindContainer();
        _line.deleteEveryEndpoint();
        _line.deleteEveryConnection();
        resolve && resolve();
      } else {
        window.jsPlumb.ready(function() {
          _line = window.jsPlumb.getInstance({
            Endpoints: [
              ["Dot", {
                radius: 1
              }],
              ["Dot", {
                radius: 1
              }]
            ],
            Connector: ["Flowchart", {
              cornerRadius: 5
            }],
            paintStyle: {
              strokeWidth: 2,
              stroke: "#f76258",
              outlineWidth: 3,
              outlineStroke: "transparent"
            },
            HoverPaintStyle: {
              strokeStyle: "#1e8151",
              lineWidth: 4
            },
            Container: container
          });
          resolve && resolve();
        });
      }
    });
  }
  _init(container).then(() => {
    _line.deleteEveryEndpoint();
    _line.deleteEveryConnection();
    _line.batch(() => {
      connList.forEach(c => {
        _line.connect({
          source: c.source,
          target: c.target,
          paintStyle: {
            strokeWidth: 2,
            stroke: "#409eff"
          },
          anchors: ["BottomCenter", "TopCenter"]
        })
      })
    }, true);
    _line.repaintEverything();
  })
}

export function getOptUUID() {
  return OPT_PREFIX + uuid();
}

export function getSelUUID() {
  return SEL_PREFIX + uuid();
}

export function optNode() {
  let id = OPT_PREFIX + uuid();
  return {
    id: id,
    name: "机器人话术",
    children: [],
    data: {
      id: id,
      operations: [{
        type: OPT_ACTION.SAY,
        sayProperties: [],
        sayOptions: {
          inputTimeout: 5000
        }
      }]
    }
  }
}

export function selNode(type, parent) {
  let id = SEL_PREFIX + uuid();
  let name = "用户回答";
  if (type == SEL_TYPE.DEFAULT) {
    name = "默认回答";
  } else if (type == SEL_TYPE.NONE) {
    name = "用户未回答";
  }
  type = SEL_TYPE.RULE;
  return {
    id,
    name,
    children: [],
    type,
    parent,
    data: {
      id: id,
      type: type,
      refNodeId: "",
      rule: ""
    }
  };
}

export function getNodeType(nodeId) {
  if (isSelection(nodeId)) {
    return "SEL";
  } else if (isOperation(nodeId)) {
    return "OPT";
  }
  return "";
}

export function isSelection(id) {
  return id && id.startsWith("sel_");
}
export function isOperation(id) {
  return id && id.startsWith("opt_");
}

export function treeToCenter() {
  let firstNode = document.querySelector('.tree-node'); //首节点
  let clientW = document.documentElement.clientWidth,
    firstLeft = parseInt(firstNode.style.left),
    left = Math.min((-firstLeft + clientW / 2 - NODE_WIDTH / 2), clientW / 2 - NODE_WIDTH / 2);
  let treeLayout = document.querySelector('.tree-layout');
  treeLayout.style.display = "none";
  treeLayout.style.left = left + "px";
  treeLayout.style.top = "40px";
  treeLayout.style.display = "block";
}

// 提交时将tree对象转换成treeContent
export function treeToJson(tree) {
  if (!tree) {
    return;
  }
  let treeJson = null;
  let _eachNode = function(node, parent) {
    let p = node.parent;
    let newNode = {
      id: node.id,
      name: node.name,
      fold: node.fold
    };
    if (isSelection(node.id)) {
      newNode.type = node.type;
      newNode.next = null;
      
      if (node.jump) {
        newNode.next = {
          jump: true,
          id: node.data ? node.data.refNodeId : "",
          flowId: node.data ? node.data.flowId : "",
          jumpMode: node.data ? node.data.jumpMode : "",
          retPosition: node.data ? node.data.retPosition : "",
          retSelection: node.data ? node.data.retSelection : ""
        };
        if(node.type === 'flow'){
          newNode.next['jumpMode'] = 'flow'
        }
      }
      parent && parent.nextRelations.push(newNode);
    } else if (isOperation(node.id)) {
      newNode.fromId = p && p.parent ? p.parent.id : "";
      newNode.fromSelectId = p ? p.id : "";
      newNode.nextRelations = [];
      parent && (parent.next = newNode);
    }
    if (treeJson == null) {
      treeJson = newNode;
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(n => _eachNode(n, newNode));
    }
  }
  _eachNode(tree)
  return treeJson;
}

// 提交时将tree对象转换成nodeContent
export function getNodeJson(tree) {
  if (!tree) {
    return;
  }
  let nodeJson = [];
  let _eachNode = function(node, parent) {
    let data = node.data;
    let jsonData = null;
    if (isOperation(node.id)) {
      let type = data && data.operations && data.operations.length ? data.operations[0].type : "";
      jsonData = {
        id: node.id,
        name: node.name,
        interfaceCode: data ? data.interfaceCode : "",
        kbId: data ? data.kbId : "",
        sms: data ? data.sms : "",
        intelligenceMatch: data ? data.intelligenceMatch : 0,
        intention: data ? data.intention : "",
        artificialAssist: null,
        operations: data ? data.operations : [],
        selections: []
      }
      //人工协助
      if (type == OPT_ACTION.SAY && data && data.artificialAssist) {
        const {
          mode,
          target,
          group,
          maxWaitSeconds
        } = data.artificialAssist;
        jsonData.artificialAssist = mode == "request" ? {
          mode,
          group,
          maxWaitSeconds
        } : {
          mode,
          target
        };
      }
      nodeJson.push(jsonData);
    } else if (isSelection(node.id) && data) {

      jsonData = {
        id: node.id,
        name: node.name,
        type: data.type,
        rule: data.rule,
      };
      if (node.type == SEL_TYPE.COUNT) {
        jsonData.count = data.count || 2;
      }
      if(data.labels){
        jsonData.labels = data.labels
      }
      parent.selections.push(jsonData);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(n => _eachNode(n, jsonData));
    }
  }
  _eachNode(tree)
  return nodeJson;
}

export const SEL_TYPE = {
  DEFAULT: "default",
  NONE: "none",
  RULE: "rule",
  COUNT: "count",
  FLOW: "flow"
}

export const OPT_ACTION = {
  SAY: "say",
  HANGUP: "hangup",
  TRANSFER: "transfer",
  SKIP: "skip",
  ASSIST: "assist"
}


export function getSpeechContent(speech) {
  if (!speech) {
    return;
  }
  return speech.map(item => item.description).join("");
}

export function contentToSpeech(txt, orgSpeech) {
  let sRefReg = "&[a-zA-Z0-9\u4e00-\u9fa5]+&",
    sVarReg = "{[a-zA-Z0-9\u4e00-\u9fa5]+}",
    sActionReg = "#[a-zA-Z0-9\u4e00-\u9fa5]+#";
  let reg = new RegExp(`(${sRefReg})|(${sVarReg})|(${sActionReg})`); //变量或者引用
  var arr = [];
  while (txt) {
    var m = txt.match(reg);
    if (m != null) {
      var index = m.index;
      let w = m[0];
      let desc = txt.substring(0, index);
      desc && arr.push(desc);
      arr.push(w);
      txt = txt.substring(index + w.length);
    } else {
      txt && arr.push(txt);
      txt = null;
    }
  }
  return arr.map(item => {
    let s = orgSpeech.find(speech => speech.description == item);
    let type = "text",
      content = item;
    if (new RegExp(sRefReg).test(item)) {
      type = "ref";
      content = item.replace(/&/g, "");
    } else if (new RegExp(sVarReg).test(item)) {
      type = "var";
      content = item.replace(/{|}/g, "");
    } else if (new RegExp(sActionReg).test(item)) {
      type = "action";
      content = item.replace(/#|#/g, "");
    } else if (s != null) {
      type = s.type;
      content = s.content;
    }
    return {
      type,
      content,
      description: item
    }
  });
}

//
export function getRefNodes(tree) {
  let nodeList = [];
  let _eachNode = function(node) {
    if (isOperation(node.id)) {
      nodeList.push({
        id: node.id,
        name: node.name
      })
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(n => _eachNode(n))
    }
  }
  _eachNode(tree);
  return nodeList;
}

export function getOptNodeError(node, tree, groupList) {
  let err = Object.create(null);
  let data = node.data || Object.create(null);
  let opts = data.operations || [];
  let isHangup = opts.find(opt => opt.type == OPT_ACTION.HANGUP) != null;
  let transfer = opts.find(opt => opt.type == OPT_ACTION.TRANSFER);
  const artificial = opts.find(opt => opt.type == OPT_ACTION.ASSIST);
  let isTransfer = transfer != null;
  //1、类型如果为say，则必须有话术内容
  let say = opts.filter(opt => opt.type == OPT_ACTION.SAY);
  err.say = opts.length == 0 || (say.length > 0 && say.find(item => item.sayProperties.length == 0) != null);
  //2、默认匹配有且只有一个（挂机节点、转接不需要)
  err.default = !isHangup && !isTransfer && node.children.findIndex(item => item.type == SEL_TYPE.DEFAULT) == -1;
  //3、节点名称不能为空
  err.name = !node.name;
  //4、转接 目标地址不能为空
  err.transfer = isTransfer && !transfer.target;
  //5、如果节点折叠，判断子节点是否有错误
  err.child = node.fold && getChildrenError(node, tree, groupList);
  //6、nlp为知识库时，是否选择了知识库
  err.knowledge = data.interfaceCode == "knowledge" && !data.kbId;
  //7、人工服务信息是否完整
  err.artificial = artificial && (!artificial.group || !artificial.mode || artificial.maxWaitSeconds === "");
  err.result = err.name || err.default || err.say || err.transfer || err.child || err.knowledge || err.artificial;
  return err;
}

export function getSelNodeError(node, tree, groupList) {
  let err = Object.create(null);
  let data = node.data;
  //1、rule类型，语法不能为空
  err.rule = data && data.type == 'rule' && !data.rule;
  //2、必须有next节点（可为跳转节点）
  err.next = !(node.children.length != 0 
    || (node.data.jumpMode === "flow" && node.data.flowId) 
    || (node.data.jumpMode === "node" && node.data.refNodeId) 
    || (node.data.type === 'flow' && node.data.flowId)
    || (node.data.jumpMode ===  'ret' && node.data.retPosition)
    || (node.data.jumpMode ===  'retMain' && node.data.retPosition)
  );


  //3、设置为跳转节点不能有子节点
  err.jump = node.jump && node.children.length > 0;
  //4、节点名称不能为空
  err.name = !node.name;
  //5、跳转节点是否存在
  err.ref = data && data.jumpMode === "node" &&  data.refNodeId && getNodeById(tree, data.refNodeId) == null;
  //6、如果节点折叠，判断子节点是否有错误
  err.child = node.fold && getChildrenError(node, tree, groupList);
  //7、话术组是否存在
  err.groupRef = data && data.jumpMode === "flow" &&  data.flowId && groupList && groupList.find(e=>e.speechSkillId === data.flowId) == null;
  err.result = err.name || err.rule || err.next || err.jump || err.ref || err.child || err.groupRef;
  return err;
}

function getChildrenError(node, tree, groupList) {
  if (node.children.length == 0) {
    return false;
  }
  let result = false;
  let _eachNode = function(_n) {
    for (let i = 0, len = _n.children.length; i < len; i++) {
      let child = _n.children[i];
      if (checkNodeError(child, tree, groupList)) {
        result = true;
        break;
      } else if (child.children.length > 0) {
        _eachNode(child);
      }
    }
  }
  _eachNode(node);
  return result;
}

function checkNodeError(node, tree, groupList) {
  if (isSelection(node.id)) {
    return getSelNodeError(node, tree, groupList).result;
  } else if (isOperation(node.id)) {
    return getOptNodeError(node, tree, groupList).result;
  }
  return false;
}

/*
 * 获取话术里的变量
 */
export function getVars(tree) {
  let vars = [];
  let _eachNode = function(node) {
    if (isOperation(node.id) && node.data) {
      let sayList = node.data.operations.filter(opt => opt.type == OPT_ACTION.SAY);
      sayList.forEach(say => {
        say.sayProperties.forEach(speech => {
          if (speech.type == "var") {
            vars.push(speech.content);
          }
        })
      })
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(n => _eachNode(n))
    }
  }
  _eachNode(tree);
  return vars;
}

export const MediaPrefix = {
  LivePush: "live-push://smts?"
}