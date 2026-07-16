# 智慧园区 · AI 驱动的智慧园区操作系统 (Smart Park AIoT Platform)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![AI](https://img.shields.io/badge/AI-Edge%20Inference-red)](https://www.tensorflow.org/)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.12-green)](https://spring.io/)
[![Vue](https://img.shields.io/badge/Vue-3.3.4-brightgreen)](https://vuejs.org/)
[![WeChat](https://img.shields.io/badge/WeChat-MiniProgram-07C160)](https://developers.weixin.qq.com/)

> 不只是物联网连接，更是 **会思考、会预警、会联动的园区数字大脑**。  
> 基于 **AIoT（人工智能+物联网）** 架构，融合 8 大类边缘计算算法，实现安防、能耗、通行全场景的“主动式智慧运营”。

---

## 🧠 核心 AI 能力矩阵（亮点速览）

我们构建了 **“云-边-端”协同 AI 推理引擎**，将被动监控升级为主动预判：

| AI 应用场景 | 核心算法能力 | 业务价值 |
| :--- | :--- | :--- |
| **🚨 异常行为分析** | 越界入侵、人员异常聚集、重点岗位离岗/睡岗/玩手机检测 | 高危事件**秒级告警**，处置响应速度提升 60% |
| **🔥 环境安全隐患** | 日间/夜间双模型烟火检测、电瓶车进电梯阻车检测 | 消防隐患“早发现、早疏散”，杜绝电动车入户 |
| **⛑️ 工业/作业安全** | 安全帽佩戴检测、反光衣穿戴识别 | 物业/施工场景强制合规，降低工伤事故率 |
| **🚗 车辆违停治理** | 消防通道/主干道违停实时抓拍与车牌识别 | 园区交通秩序无人化治理，车道畅通率 99% |
| **👤 多模态生物识别** | 双目活体人脸识别（FRR≤0.5%）、以图搜图、结构化属性检索 | 通行体验无感化，重点人员布控告警精准溯源 |
| **📊 能耗异常诊断** | 同比/环比突变检测、峰谷负荷预测、跑冒滴漏智能研判 | 用能异常自动推送工单，节能降碳可量化 |

> 📌 **AI 调度机制**：统一 GPU 算法池调度，支持 H.264→H.265 实时转码降码率，AI 事件自动触发「抓拍+前后15秒录像联动」，并自动生成维修工单。

---

## 🏗️ 系统全景架构（功能模块一览）

项目采用微服务 + 边缘计算分层架构，覆盖 **11 大业务域**：

| 模块 | 后台管理 | 小程序 | AI 赋能程度 |
| :--- | :---: | :---: | :--- |
| **智能视频安防** | ● | — | ⭐⭐⭐⭐⭐ (全算法集成) |
| **门禁、人行及访客** | ● | ● | ⭐⭐⭐⭐ (人脸识别/防尾随) |
| **智慧停车及收费** | ● | ● | ⭐⭐⭐ (车牌识别/无感支付) |
| **综合指挥 IOC** | ● | — | ⭐⭐⭐⭐ (AI告警联动/应急一键调度) |
| **物联网设备管理** | ● | — | ⭐⭐⭐ (边缘规则引擎/断网续传) |
| **智慧能耗管理** | ● | ● | ⭐⭐⭐ (异常阈值AI研判) |
| **运维/工单/巡检** | ● | ● | ⭐⭐ (告警自动转单) |
| *平台管理 / 数据中台 / 梯控 / WiFi&广告* | ● | 部分 | 详见下方文档 |

---

## 🛠️ 详细技术栈（分层次说明）

> 所有组件均采用 **开源或商业友好** 方案，版本号已锁定稳定版。

### 1️⃣ 后端业务平台
| 组件 | 技术选型 | 版本 | 用途说明 |
| :--- | :--- | :--- | :--- |
| 核心框架 | Spring Cloud Alibaba | 2021.0.5.0 | 微服务治理（注册/配置/网关/熔断） |
| 业务框架 | Spring Boot | 2.7.12 | 基础 Web 容器与自动配置 |
| ORM 框架 | Mybatis-Plus | 3.5.3 | 数据持久化，简化 CRUD |
| 安全认证 | Spring Security + JWT | 5.8.3 | 统一身份认证与权限控制（RBAC） |
| API 文档 | Knife4j (Swagger3) | 4.1.0 | 自动生成接口文档与在线调试 |
| 定时任务 | XXL-JOB | 2.4.0 | 分布式任务调度（报表生成/数据同步） |
| 日志链路 | ELK (Elasticsearch+Logstash+Kibana) | 8.9.0 | 集中日志收集、检索与可视化 |

### 2️⃣ 前端与移动端
| 组件 | 技术选型 | 版本 | 用途说明 |
| :--- | :--- | :--- | :--- |
| 后台管理 UI | Vue 3 + TypeScript | 3.3.4 | 响应式单页应用框架 |
| 后台组件库 | Element Plus | 2.4.2 | 企业级后台 UI 组件库 |
| 状态管理 | Pinia | 2.1.6 | 轻量级状态管理 |
| 数据可视化 | ECharts 5 + DataV | 5.4.3 | 大屏驾驶舱及各类统计图表 |
| 视频播放 | WebRTC + HLS.js | - | 无插件实时视频流与回放 |
| 小程序端 | 原生微信小程序 + WeUI | 基础库 2.32.3 | 面向员工/访客的移动服务门户 |

### 3️⃣ AI 与边缘计算
| 组件 | 技术选型 | 版本 | 用途说明 |
| :--- | :--- | :--- | :--- |
| 深度学习框架 | TensorFlow 2.x / PyTorch 2.0 | - | 模型训练与量化 |
| 推理加速引擎 | TensorRT / OpenVINO | 8.6 / 2023.2 | GPU 或 CPU 推理加速（NVIDIA/Intel） |
| 边缘推理硬件 | 华为 Atlas 300 / NVIDIA Jetson Orin | - | 边缘盒子部署（断网自治） |
| 算法调度平台 | 自研 AI 任务调度器（基于 Redis Streams） | - | 统一管理 GPU 资源、任务队列与负载均衡 |
| 视频结构化 | FFmpeg + OpenCV | 6.0 / 4.8 | 视频解码、抽帧、图像预处理 |

### 4️⃣ 物联网接入层
| 组件 | 技术选型 | 版本 | 用途说明 |
| :--- | :--- | :--- | :--- |
| MQTT Broker | EMQX (开源版) | 5.3.2 | 高并发设备消息接入（支持 100 万连接） |
| 自定义协议解析 | Netty 4 | 4.1.94 | 处理私有 TCP/UDP 协议（如门禁/梯控） |
| 视频设备接入 | GB/T 28181-2022 / ONVIF / RTSP | - | 接入海康/大华等主流摄像机 |
| 楼宇自动化 | BACnet/IP 协议栈 | - | 对接 BA 系统（空调/照明） |
| 工业协议 | Modbus TCP/RTU, OPC UA | - | 接入电表/水表/传感器 |
| 边缘网关软件 | Kuiper (LF Edge) | 1.12.0 | 边缘侧流式数据处理与规则引擎 |

### 5️⃣ 数据存储与中间件
| 组件 | 技术选型 | 版本 | 用途说明 |
| :--- | :--- | :--- | :--- |
| 关系数据库 | MySQL (Percona) | 8.0.34 | 业务主库（人员/订单/工单等） |
| 时序数据库 | InfluxDB (社区版) | 2.7.1 | 存储设备实时上报（能耗/温度/状态） |
| 缓存与消息 | Redis (单机/哨兵) | 7.2.0 | 缓存+轻量级消息队列（任务分发） |
| 搜索引擎 | Elasticsearch | 8.9.0 | 操作日志、设备检索、以图搜图索引 |
| 对象存储 | MinIO (兼容 S3) | RELEASE.2023-08-30 | 存储抓拍图片、录像切片、文件 |
| 数据同步 | DataX / Canal | 3.0 / 1.1.7 | 异构数据同步与增量订阅（MySQL→ES） |
| 流计算引擎 | Flink (用于实时统计) | 1.17.1 | 实时计算车流/人流/告警聚合 |

### 6️⃣ 部署与运维
| 组件 | 技术选型 | 版本 | 用途说明 |
| :--- | :--- | :--- | :--- |
| 容器化 | Docker + Docker Compose | 24.0 | 快速搭建开发/测试环境 |
| 编排与集群 | Kubernetes (可选) | 1.28 | 生产环境高可用部署 |
| CI/CD | Jenkins / GitLab CI | - | 自动化构建与部署 |
| 监控告警 | Prometheus + Grafana | 2.46 / 10.2 | 系统资源、应用性能监控（JVM/数据库） |
| 链路追踪 | SkyWalking | 9.4.0 | 分布式调用链分析 |

---

## ⚡ 极速开始 (Quick Start)

```bash
# 1. 克隆代码
git clone https://github.com/yourname/haichuang-ai-park.git

# 2. 启动基础中间件 (docker-compose up -d)
cd docker && docker-compose up -d   # 包含 MySQL, Redis, InfluxDB, MinIO, EMQX

# 3. 启动后端微服务 (需 JDK 17)
cd ../backend
mvn clean install -DskipTests
java -jar iot-service/target/*.jar &
java -jar auth-service/target/*.jar &
# ... 依次启动其他服务

# 4. 启动后台管理前端
cd ../frontend-admin
npm install && npm run dev

# 5. 小程序用微信开发者工具打开 wechat-miniprogram 目录