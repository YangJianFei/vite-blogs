/*
title:[NewLife.XCode]分表分库（百亿级大数据存储）
date:2020-10-25
keyword:大数据,百亿级
*/

<div id="cnblogs_post_body" class="blogpost-body blogpost-body-html"><a name="_labelTop"></a><div id="navCategory"><p style="font-size:16px"><b>阅读目录</b></p><ul><li><a href="#_label0">例程剖析&nbsp;</a></li><li><a href="#_label1">分表查询</a></li><li><a href="#_label2">分表策略</a></li><li><a href="#_label3">分表与分区对比</a></li><li><a href="#_label4">博文答疑</a></li><li><a href="#_label5">系列教程</a></li></ul></div>
<p>NewLife.XCode是一个有15年历史的开源数据中间件，支持netcore/net45/net40，由新生命团队(2002~2019)开发完成并维护至今，以下简称XCode。</p>
<p>整个系列教程会大量结合示例代码和运行日志来进行深入分析，蕴含多年开发经验于其中，代表作有百亿级大数据实时计算项目。</p>
<p>开源地址：<a href="https://github.com/NewLifeX/X" target="_blank" rel="noopener">https://github.com/NewLifeX/X&nbsp;</a>（求star, 938+）</p>
<p>&nbsp;</p>
<p>XCode是重度充血模型，以单表操作为核心，不支持多表关联Join，复杂查询只能在where上做文章，整个select语句一定是from单表，因此对分表操作具有天然优势！</p>
<p><strong><span style="color: rgba(0, 0, 255, 1)">！！&nbsp;阅读本文之前，建议回顾<a href="https://www.cnblogs.com/nnhy/p/xcode_100billion.html" target="_blank" rel="noopener"><span style="color: rgba(0, 0, 255, 1)">《百亿级性能》</span></a>，其中“<a href="https://www.cnblogs.com/nnhy/p/xcode_100billion.html#autoid-2-0-0" target="_blank" rel="noopener"><span style="color: rgba(0, 0, 255, 1)">索引完备</span></a>”章节详细描述了大型数据表的核心要点。</span></strong></p>
<p>&nbsp;</p>
<p>100亿数据其实并不多，一个比较常见的数据分表分库模型：</p>
<p>MySql数据库8主8从，每服务器8个库，每个库16张表，共1024张表（从库也有1024张表） ，每张表1000万到5000万数据，整好100亿到500亿数据！</p>
<p>&nbsp;</p>
<div style="text-align: right"><a href="#_labelTop">回到目录</a><a name="_label0"></a></div><h1 id="autoid-0-0-0">例程剖析&nbsp;<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button></h1>
<p>例程位置：<a href="https://github.com/NewLifeX/X/tree/master/Samples/SplitTableOrDatabase" target="_blank" rel="noopener">https://github.com/NewLifeX/X/tree/master/Samples/SplitTableOrDatabase</a>&nbsp;</p>
<p>新建控制台项目，nuget引用NewLife.XCode后，建立一个实体模型（修改Model.xml）：</p>
<div class="cnblogs_code"><div class="cnblogs_code_toolbar"><span class="cnblogs_code_copy"><a href="javascript:void(0);" onclick="copyCnblogsCode(this)" title="复制代码"><img src="//common.cnblogs.com/images/copycode.gif" alt="复制代码"></a></span></div>
<pre><span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Tables </span><span style="color: rgba(255, 0, 0, 1)">Version</span><span style="color: rgba(0, 0, 255, 1)">="9.12.7136.19046"</span><span style="color: rgba(255, 0, 0, 1)"> NameSpace</span><span style="color: rgba(0, 0, 255, 1)">="STOD.Entity"</span><span style="color: rgba(255, 0, 0, 1)"> ConnName</span><span style="color: rgba(0, 0, 255, 1)">="STOD"</span><span style="color: rgba(255, 0, 0, 1)"> Output</span><span style="color: rgba(0, 0, 255, 1)">=""</span><span style="color: rgba(255, 0, 0, 1)"> BaseClass</span><span style="color: rgba(0, 0, 255, 1)">="Entity"</span><span style="color: rgba(255, 0, 0, 1)"> xmlns:xs</span><span style="color: rgba(0, 0, 255, 1)">="http://www.w3.org/2001/XMLSchema-instance"</span><span style="color: rgba(255, 0, 0, 1)"> xs:schemaLocation</span><span style="color: rgba(0, 0, 255, 1)">="http://www.newlifex.com https://raw.githubusercontent.com/NewLifeX/X/master/XCode/ModelSchema.xsd"</span><span style="color: rgba(255, 0, 0, 1)"> xmlns</span><span style="color: rgba(0, 0, 255, 1)">="http://www.newlifex.com/ModelSchema.xsd"</span><span style="color: rgba(0, 0, 255, 1)">&gt;</span>
  <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Table </span><span style="color: rgba(255, 0, 0, 1)">Name</span><span style="color: rgba(0, 0, 255, 1)">="History"</span><span style="color: rgba(255, 0, 0, 1)"> Description</span><span style="color: rgba(0, 0, 255, 1)">="历史"</span><span style="color: rgba(0, 0, 255, 1)">&gt;</span>
    <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Columns</span><span style="color: rgba(0, 0, 255, 1)">&gt;</span>
      <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Column </span><span style="color: rgba(255, 0, 0, 1)">Name</span><span style="color: rgba(0, 0, 255, 1)">="ID"</span><span style="color: rgba(255, 0, 0, 1)"> DataType</span><span style="color: rgba(0, 0, 255, 1)">="Int32"</span><span style="color: rgba(255, 0, 0, 1)"> Identity</span><span style="color: rgba(0, 0, 255, 1)">="True"</span><span style="color: rgba(255, 0, 0, 1)"> PrimaryKey</span><span style="color: rgba(0, 0, 255, 1)">="True"</span><span style="color: rgba(255, 0, 0, 1)"> Description</span><span style="color: rgba(0, 0, 255, 1)">="编号"</span> <span style="color: rgba(0, 0, 255, 1)">/&gt;</span>
      <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Column </span><span style="color: rgba(255, 0, 0, 1)">Name</span><span style="color: rgba(0, 0, 255, 1)">="Category"</span><span style="color: rgba(255, 0, 0, 1)"> DataType</span><span style="color: rgba(0, 0, 255, 1)">="String"</span><span style="color: rgba(255, 0, 0, 1)"> Description</span><span style="color: rgba(0, 0, 255, 1)">="类别"</span> <span style="color: rgba(0, 0, 255, 1)">/&gt;</span>
      <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Column </span><span style="color: rgba(255, 0, 0, 1)">Name</span><span style="color: rgba(0, 0, 255, 1)">="Action"</span><span style="color: rgba(255, 0, 0, 1)"> DataType</span><span style="color: rgba(0, 0, 255, 1)">="String"</span><span style="color: rgba(255, 0, 0, 1)"> Description</span><span style="color: rgba(0, 0, 255, 1)">="操作"</span> <span style="color: rgba(0, 0, 255, 1)">/&gt;</span>
      <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Column </span><span style="color: rgba(255, 0, 0, 1)">Name</span><span style="color: rgba(0, 0, 255, 1)">="UserName"</span><span style="color: rgba(255, 0, 0, 1)"> DataType</span><span style="color: rgba(0, 0, 255, 1)">="String"</span><span style="color: rgba(255, 0, 0, 1)"> Description</span><span style="color: rgba(0, 0, 255, 1)">="用户名"</span> <span style="color: rgba(0, 0, 255, 1)">/&gt;</span>
      <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Column </span><span style="color: rgba(255, 0, 0, 1)">Name</span><span style="color: rgba(0, 0, 255, 1)">="CreateUserID"</span><span style="color: rgba(255, 0, 0, 1)"> DataType</span><span style="color: rgba(0, 0, 255, 1)">="Int32"</span><span style="color: rgba(255, 0, 0, 1)"> Description</span><span style="color: rgba(0, 0, 255, 1)">="用户编号"</span> <span style="color: rgba(0, 0, 255, 1)">/&gt;</span>
      <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Column </span><span style="color: rgba(255, 0, 0, 1)">Name</span><span style="color: rgba(0, 0, 255, 1)">="CreateIP"</span><span style="color: rgba(255, 0, 0, 1)"> DataType</span><span style="color: rgba(0, 0, 255, 1)">="String"</span><span style="color: rgba(255, 0, 0, 1)"> Description</span><span style="color: rgba(0, 0, 255, 1)">="IP地址"</span> <span style="color: rgba(0, 0, 255, 1)">/&gt;</span>
      <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Column </span><span style="color: rgba(255, 0, 0, 1)">Name</span><span style="color: rgba(0, 0, 255, 1)">="CreateTime"</span><span style="color: rgba(255, 0, 0, 1)"> DataType</span><span style="color: rgba(0, 0, 255, 1)">="DateTime"</span><span style="color: rgba(255, 0, 0, 1)"> Description</span><span style="color: rgba(0, 0, 255, 1)">="时间"</span> <span style="color: rgba(0, 0, 255, 1)">/&gt;</span>
      <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Column </span><span style="color: rgba(255, 0, 0, 1)">Name</span><span style="color: rgba(0, 0, 255, 1)">="Remark"</span><span style="color: rgba(255, 0, 0, 1)"> DataType</span><span style="color: rgba(0, 0, 255, 1)">="String"</span><span style="color: rgba(255, 0, 0, 1)"> Length</span><span style="color: rgba(0, 0, 255, 1)">="500"</span><span style="color: rgba(255, 0, 0, 1)"> Description</span><span style="color: rgba(0, 0, 255, 1)">="详细信息"</span> <span style="color: rgba(0, 0, 255, 1)">/&gt;</span>
    <span style="color: rgba(0, 0, 255, 1)">&lt;/</span><span style="color: rgba(128, 0, 0, 1)">Columns</span><span style="color: rgba(0, 0, 255, 1)">&gt;</span>
    <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Indexes</span><span style="color: rgba(0, 0, 255, 1)">&gt;</span>
      <span style="color: rgba(0, 0, 255, 1)">&lt;</span><span style="color: rgba(128, 0, 0, 1)">Index </span><span style="color: rgba(255, 0, 0, 1)">Columns</span><span style="color: rgba(0, 0, 255, 1)">="CreateTime"</span> <span style="color: rgba(0, 0, 255, 1)">/&gt;</span>
    <span style="color: rgba(0, 0, 255, 1)">&lt;/</span><span style="color: rgba(128, 0, 0, 1)">Indexes</span><span style="color: rgba(0, 0, 255, 1)">&gt;</span>
  <span style="color: rgba(0, 0, 255, 1)">&lt;/</span><span style="color: rgba(128, 0, 0, 1)">Table</span><span style="color: rgba(0, 0, 255, 1)">&gt;</span>
<span style="color: rgba(0, 0, 255, 1)">&lt;/</span><span style="color: rgba(128, 0, 0, 1)">Tables</span><span style="color: rgba(0, 0, 255, 1)">&gt;</span></pre>
<div class="cnblogs_code_toolbar"><span class="cnblogs_code_copy"><a href="javascript:void(0);" onclick="copyCnblogsCode(this)" title="复制代码"><img src="//common.cnblogs.com/images/copycode.gif" alt="复制代码"></a></span></div></div>
<p>在Build.tt上右键运行自定义工具，生成实体类“历史.cs”和“历史.Biz.cs”。不用修改其中代码，待会我们将借助该实体类来演示分表分库用法。</p>
<p>为了方便，我们将使用SQLite数据库，因此不需要配置任何数据库连接，XCode检测到没有名为STOD的连接字符串时，将默认使用SQLite。</p>
<p>此外，也可以通过指定名为STOD的连接字符串，使用其它非SQLite数据库。</p>
<p>&nbsp;</p>
<h2 id="autoid-1-0-0">按数字散列分表分库<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button></h2>
<p>大量订单、用户等信息，可采用crc16散列分表，我们把该实体数据拆分到4个库共16张表里面：</p>
<div class="cnblogs_code"><div class="cnblogs_code_toolbar"><span class="cnblogs_code_copy"><a href="javascript:void(0);" onclick="copyCnblogsCode(this)" title="复制代码"><img src="//common.cnblogs.com/images/copycode.gif" alt="复制代码"></a></span></div>
<pre><span style="color: rgba(0, 0, 255, 1)">static</span> <span style="color: rgba(0, 0, 255, 1)">void</span><span style="color: rgba(0, 0, 0, 1)"> TestByNumber()
{
    XTrace.WriteLine(</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">按数字分表分库</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">);

    </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 预先准备好各个库的连接字符串，动态增加，也可以在配置文件写好</span>
    <span style="color: rgba(0, 0, 255, 1)">for</span> (<span style="color: rgba(0, 0, 255, 1)">var</span> i = <span style="color: rgba(128, 0, 128, 1)">0</span>; i &lt; <span style="color: rgba(128, 0, 128, 1)">4</span>; i++<span style="color: rgba(0, 0, 0, 1)">)
    {
        </span><span style="color: rgba(0, 0, 255, 1)">var</span> connName = $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">HDB_{i + 1}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">;
        DAL.AddConnStr(connName, $</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">data source=numberData\\{connName}.db</span><span style="color: rgba(128, 0, 0, 1)">"</span>, <span style="color: rgba(0, 0, 255, 1)">null</span>, <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">sqlite</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">);
        History.Meta.ConnName </span>=<span style="color: rgba(0, 0, 0, 1)"> connName;

        </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 每库建立4张表。这一步不是必须的，首次读写数据时也会创建
        </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)">for (var j = 0; j &lt; 4; j++)
        </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)">{
        </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)">    History.Meta.TableName = $"History_{j + 1}";

        </span><span style="color: rgba(0, 128, 0, 1)">//</span>    <span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 初始化数据表
        </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)">    History.Meta.Session.InitData();
        </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)">}</span>
<span style="color: rgba(0, 0, 0, 1)">    }

    </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)">!!! 写入数据测试

    </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 4个库</span>
    <span style="color: rgba(0, 0, 255, 1)">for</span> (<span style="color: rgba(0, 0, 255, 1)">var</span> i = <span style="color: rgba(128, 0, 128, 1)">0</span>; i &lt; <span style="color: rgba(128, 0, 128, 1)">4</span>; i++<span style="color: rgba(0, 0, 0, 1)">)
    {
        </span><span style="color: rgba(0, 0, 255, 1)">var</span> connName = $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">HDB_{i + 1}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">;
        History.Meta.ConnName </span>=<span style="color: rgba(0, 0, 0, 1)"> connName;

        </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 每库4张表</span>
        <span style="color: rgba(0, 0, 255, 1)">for</span> (<span style="color: rgba(0, 0, 255, 1)">var</span> j = <span style="color: rgba(128, 0, 128, 1)">0</span>; j &lt; <span style="color: rgba(128, 0, 128, 1)">4</span>; j++<span style="color: rgba(0, 0, 0, 1)">)
        {
            History.Meta.TableName </span>= $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">History_{j + 1}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">;

            </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 插入一批数据</span>
            <span style="color: rgba(0, 0, 255, 1)">var</span> list = <span style="color: rgba(0, 0, 255, 1)">new</span> List&lt;History&gt;<span style="color: rgba(0, 0, 0, 1)">();
            </span><span style="color: rgba(0, 0, 255, 1)">for</span> (<span style="color: rgba(0, 0, 255, 1)">var</span> n = <span style="color: rgba(128, 0, 128, 1)">0</span>; n &lt; <span style="color: rgba(128, 0, 128, 1)">1000</span>; n++<span style="color: rgba(0, 0, 0, 1)">)
            {
                </span><span style="color: rgba(0, 0, 255, 1)">var</span> entity = <span style="color: rgba(0, 0, 255, 1)">new</span><span style="color: rgba(0, 0, 0, 1)"> History
                {
                    Category </span>= <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">交易</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">,
                    Action </span>= <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">转账</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">,
                    CreateUserID </span>= <span style="color: rgba(128, 0, 128, 1)">1234</span><span style="color: rgba(0, 0, 0, 1)">,
                    CreateTime </span>=<span style="color: rgba(0, 0, 0, 1)"> DateTime.Now,
                    Remark </span>= $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">[{Rand.NextString(6)}]向[{Rand.NextString(6)}]转账[￥{Rand.Next(1_000_000) / 100d}]</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">
                };

                list.Add(entity);
            }

            </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 批量插入。两种写法等价
            </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)">list.BatchInsert();</span>
            list.Insert(<span style="color: rgba(0, 0, 255, 1)">true</span><span style="color: rgba(0, 0, 0, 1)">);
        }
    }
}</span></pre>
<div class="cnblogs_code_toolbar"><span class="cnblogs_code_copy"><a href="javascript:void(0);" onclick="copyCnblogsCode(this)" title="复制代码"><img src="//common.cnblogs.com/images/copycode.gif" alt="复制代码"></a></span></div></div>
<p>通过 DAL.AddConnStr&nbsp;动态向系统注册连接字符串：</p>
<blockquote>
<p>var connName = $"HDB_{i + 1}";</p>
<p>DAL.AddConnStr(connName, $"data source=numberData\\{connName}.db", null, "sqlite");</p>
</blockquote>
<p>连接名必须唯一，且有规律，后面要用到。数据库名最好也有一定规律。&nbsp;</p>
<p>使用时通过Meta.ConnName指定后续操作的连接名，Meta.TableName指定后续操作的表名，本线程有效，不会干涉其它线程。</p>
<blockquote>
<p>var connName = $"HDB_{i + 1}";<br>History.Meta.ConnName = connName;</p>
<p>History.Meta.TableName = $"History_{j + 1}";</p>






</blockquote>
<p>注意，ConnName/TableName改变后，将会一直维持该参数，直到修改为新的连接名和表名。</p>
<p>指定表名连接名后，即可在本线程内持续使用，后面使用批量插入技术，给每张表插入一批数据。</p>
<p>&nbsp;</p>
<p>运行效果如下：</p>
<p><img src="https://img2018.cnblogs.com/blog/19592/201909/19592-20190909001859813-1389523192.png" alt=""></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p><img src="https://img2018.cnblogs.com/blog/19592/201909/19592-20190909002135845-1364778261.png" alt=""></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>连接字符串指定的numberData目录下，生成了4个数据库，每个数据库生成了4张表，每张表内插入1000行数据。</p>
<p>指定不存在的数据库和数据表时，<a href="https://www.cnblogs.com/nnhy/p/xcode_negative.html" target="_blank" rel="noopener">XCode的反向工程</a>将会自动建表建库，这是它独有的功能。（因异步操作，密集建表建库时可能有一定几率失败，重试即可）</p>
<p>&nbsp;</p>
<h2 id="autoid-1-1-0">按时间序列分表分库<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button></h2>
<p>日志型的时间序列数据，特别适合分表分库存储，定型拆分模式是，每月一个库每天一张表。</p>
<div class="cnblogs_code"><div class="cnblogs_code_toolbar"><span class="cnblogs_code_copy"><a href="javascript:void(0);" onclick="copyCnblogsCode(this)" title="复制代码"><img src="//common.cnblogs.com/images/copycode.gif" alt="复制代码"></a></span></div>
<pre><span style="color: rgba(0, 0, 255, 1)">static</span> <span style="color: rgba(0, 0, 255, 1)">void</span><span style="color: rgba(0, 0, 0, 1)"> TestByDate()
{
    XTrace.WriteLine(</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">按时间分表分库，每月一个库，每天一张表</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">);

    </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 预先准备好各个库的连接字符串，动态增加，也可以在配置文件写好</span>
    <span style="color: rgba(0, 0, 255, 1)">var</span> start =<span style="color: rgba(0, 0, 0, 1)"> DateTime.Today;
    </span><span style="color: rgba(0, 0, 255, 1)">for</span> (<span style="color: rgba(0, 0, 255, 1)">var</span> i = <span style="color: rgba(128, 0, 128, 1)">0</span>; i &lt; <span style="color: rgba(128, 0, 128, 1)">12</span>; i++<span style="color: rgba(0, 0, 0, 1)">)
    {
        </span><span style="color: rgba(0, 0, 255, 1)">var</span> dt = <span style="color: rgba(0, 0, 255, 1)">new</span> DateTime(start.Year, i + <span style="color: rgba(128, 0, 128, 1)">1</span>, <span style="color: rgba(128, 0, 128, 1)">1</span><span style="color: rgba(0, 0, 0, 1)">);
        </span><span style="color: rgba(0, 0, 255, 1)">var</span> connName = $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">HDB_{dt:yyMM}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">;
        DAL.AddConnStr(connName, $</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">data source=timeData\\{connName}.db</span><span style="color: rgba(128, 0, 0, 1)">"</span>, <span style="color: rgba(0, 0, 255, 1)">null</span>, <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">sqlite</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">);
    }

    </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 每月一个库，每天一张表</span>
    start = <span style="color: rgba(0, 0, 255, 1)">new</span> DateTime(start.Year, <span style="color: rgba(128, 0, 128, 1)">1</span>, <span style="color: rgba(128, 0, 128, 1)">1</span><span style="color: rgba(0, 0, 0, 1)">);
    </span><span style="color: rgba(0, 0, 255, 1)">for</span> (<span style="color: rgba(0, 0, 255, 1)">var</span> i = <span style="color: rgba(128, 0, 128, 1)">0</span>; i &lt; <span style="color: rgba(128, 0, 128, 1)">365</span>; i++<span style="color: rgba(0, 0, 0, 1)">)
    {
        </span><span style="color: rgba(0, 0, 255, 1)">var</span> dt =<span style="color: rgba(0, 0, 0, 1)"> start.AddDays(i);
        History.Meta.ConnName </span>= $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">HDB_{dt:yyMM}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">;
        History.Meta.TableName </span>= $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">History_{dt:yyMMdd}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">;

        </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 插入一批数据</span>
        <span style="color: rgba(0, 0, 255, 1)">var</span> list = <span style="color: rgba(0, 0, 255, 1)">new</span> List&lt;History&gt;<span style="color: rgba(0, 0, 0, 1)">();
        </span><span style="color: rgba(0, 0, 255, 1)">for</span> (<span style="color: rgba(0, 0, 255, 1)">var</span> n = <span style="color: rgba(128, 0, 128, 1)">0</span>; n &lt; <span style="color: rgba(128, 0, 128, 1)">1000</span>; n++<span style="color: rgba(0, 0, 0, 1)">)
        {
            </span><span style="color: rgba(0, 0, 255, 1)">var</span> entity = <span style="color: rgba(0, 0, 255, 1)">new</span><span style="color: rgba(0, 0, 0, 1)"> History
            {
                Category </span>= <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">交易</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">,
                Action </span>= <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">转账</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">,
                CreateUserID </span>= <span style="color: rgba(128, 0, 128, 1)">1234</span><span style="color: rgba(0, 0, 0, 1)">,
                CreateTime </span>=<span style="color: rgba(0, 0, 0, 1)"> DateTime.Now,
                Remark </span>= $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">[{Rand.NextString(6)}]向[{Rand.NextString(6)}]转账[￥{Rand.Next(1_000_000) / 100d}]</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">
            };

            list.Add(entity);
        }

        </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 批量插入。两种写法等价
        </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)">list.BatchInsert();</span>
        list.Insert(<span style="color: rgba(0, 0, 255, 1)">true</span><span style="color: rgba(0, 0, 0, 1)">);
    }
}</span></pre>
<div class="cnblogs_code_toolbar"><span class="cnblogs_code_copy"><a href="javascript:void(0);" onclick="copyCnblogsCode(this)" title="复制代码"><img src="//common.cnblogs.com/images/copycode.gif" alt="复制代码"></a></span></div></div>
<p>时间序列分表看起来比数字散列更简单一些，分表逻辑清晰明了。</p>
<p><img src="https://img2018.cnblogs.com/blog/19592/201909/19592-20190909004223304-1144258613.png" alt=""></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;<img src="https://img2018.cnblogs.com/blog/19592/201909/19592-20190909004327667-1772911506.png" alt=""></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;例程遍历了今年的365天，在连接字符串指定的timeData目录下，生成了12个月份数据库，然后每个库里面按月生成数据表，每张表插入1000行模拟数据。</p>
<p>&nbsp;</p>
<p>综上，分表分库其实就是在操作数据库之前，预先设置好 Meta.ConnName/Meta.TableName，其它操作不变！</p>
<p>&nbsp;</p>
<div style="text-align: right"><a href="#_labelTop">回到目录</a><a name="_label1"></a></div><h1 id="autoid-1-2-0">分表查询<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button></h1>
<p>说到分表，许多人第一反应就是，怎么做跨表查询？</p>
<p>不好意思，不支持！</p>
<p>只能在多张表上各自查询，如果系统设计不合理，甚至可能需要在所有表上进行查询。</p>
<p>不建议做视图union，那样会无穷无尽，业务逻辑还是放在代码中为好，数据库做好存储与基础计算。</p>
<p>&nbsp;</p>
<p>分表查询的用法与分表添删改一样：</p>
<div class="cnblogs_code"><div class="cnblogs_code_toolbar"><span class="cnblogs_code_copy"><a href="javascript:void(0);" onclick="copyCnblogsCode(this)" title="复制代码"><img src="//common.cnblogs.com/images/copycode.gif" alt="复制代码"></a></span></div>
<pre><span style="color: rgba(0, 0, 255, 1)">static</span> <span style="color: rgba(0, 0, 255, 1)">void</span><span style="color: rgba(0, 0, 0, 1)"> SearchByDate()
{
    </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 预先准备好各个库的连接字符串，动态增加，也可以在配置文件写好</span>
    <span style="color: rgba(0, 0, 255, 1)">var</span> start =<span style="color: rgba(0, 0, 0, 1)"> DateTime.Today;
    </span><span style="color: rgba(0, 0, 255, 1)">for</span> (<span style="color: rgba(0, 0, 255, 1)">var</span> i = <span style="color: rgba(128, 0, 128, 1)">0</span>; i &lt; <span style="color: rgba(128, 0, 128, 1)">12</span>; i++<span style="color: rgba(0, 0, 0, 1)">)
    {
        </span><span style="color: rgba(0, 0, 255, 1)">var</span> dt = <span style="color: rgba(0, 0, 255, 1)">new</span> DateTime(start.Year, i + <span style="color: rgba(128, 0, 128, 1)">1</span>, <span style="color: rgba(128, 0, 128, 1)">1</span><span style="color: rgba(0, 0, 0, 1)">);
        </span><span style="color: rgba(0, 0, 255, 1)">var</span> connName = $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">HDB_{dt:yyMM}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">;
        DAL.AddConnStr(connName, $</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">data source=timeData\\{connName}.db</span><span style="color: rgba(128, 0, 0, 1)">"</span>, <span style="color: rgba(0, 0, 255, 1)">null</span>, <span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">sqlite</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">);
    }

    </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 随机日期。批量操作</span>
    start = <span style="color: rgba(0, 0, 255, 1)">new</span> DateTime(start.Year, <span style="color: rgba(128, 0, 128, 1)">1</span>, <span style="color: rgba(128, 0, 128, 1)">1</span><span style="color: rgba(0, 0, 0, 1)">);
    {
        </span><span style="color: rgba(0, 0, 255, 1)">var</span> dt = start.AddDays(Rand.Next(<span style="color: rgba(128, 0, 128, 1)">0</span>, <span style="color: rgba(128, 0, 128, 1)">365</span><span style="color: rgba(0, 0, 0, 1)">));
        XTrace.WriteLine(</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">查询日期：{0}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">, dt);

        History.Meta.ConnName </span>= $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">HDB_{dt:yyMM}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">;
        History.Meta.TableName </span>= $<span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">History_{dt:yyMMdd}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">;

        </span><span style="color: rgba(0, 0, 255, 1)">var</span> list =<span style="color: rgba(0, 0, 0, 1)"> History.FindAll();
        XTrace.WriteLine(</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">数据：{0}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">, list.Count);
    }

    </span><span style="color: rgba(0, 128, 0, 1)">//</span><span style="color: rgba(0, 128, 0, 1)"> 随机日期。个例操作</span>
    start = <span style="color: rgba(0, 0, 255, 1)">new</span> DateTime(start.Year, <span style="color: rgba(128, 0, 128, 1)">1</span>, <span style="color: rgba(128, 0, 128, 1)">1</span><span style="color: rgba(0, 0, 0, 1)">);
    {
        </span><span style="color: rgba(0, 0, 255, 1)">var</span> dt = start.AddDays(Rand.Next(<span style="color: rgba(128, 0, 128, 1)">0</span>, <span style="color: rgba(128, 0, 128, 1)">365</span><span style="color: rgba(0, 0, 0, 1)">));
        XTrace.WriteLine(</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">查询日期：{0}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">, dt);
        </span><span style="color: rgba(0, 0, 255, 1)">var</span> list =<span style="color: rgba(0, 0, 0, 1)"> History.Meta.ProcessWithSplit(
            $</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">HDB_{dt:yyMM}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">,
            $</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">History_{dt:yyMMdd}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">,
            () </span>=&gt;<span style="color: rgba(0, 0, 0, 1)"> History.FindAll());

        XTrace.WriteLine(</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(128, 0, 0, 1)">数据：{0}</span><span style="color: rgba(128, 0, 0, 1)">"</span><span style="color: rgba(0, 0, 0, 1)">, list.Count);
    }
}</span></pre>
<div class="cnblogs_code_toolbar"><span class="cnblogs_code_copy"><a href="javascript:void(0);" onclick="copyCnblogsCode(this)" title="复制代码"><img src="//common.cnblogs.com/images/copycode.gif" alt="复制代码"></a></span></div></div>
<p><img src="https://img2018.cnblogs.com/blog/19592/201909/19592-20190909005818384-44108798.png" alt=""></p>
<p>&nbsp;</p>
<p>仍然是通过设置 Meta.ConnName/Meta.TableName&nbsp;来实现分表分库。日志输出可以看到查找了哪个库哪张表。</p>
<p>这里多了一个&nbsp;History.Meta.ProcessWithSplit&nbsp; ，其实是快捷方法，在回调内使用连接名和表名，退出后复原。</p>
<p>&nbsp;</p>
<p>分表分库后，最容易犯下的错误，就是使用时忘了设置表名，在错误的表上查找数据，然后怎么也查不到……</p>
<p>&nbsp;</p>
<div style="text-align: right"><a href="#_labelTop">回到目录</a><a name="_label2"></a></div><h1 id="autoid-2-0-0">分表策略<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button></h1>
<p>根据这些年的经验：</p>
<ul>
<li>Oracle适合单表1000万~1亿行数据，要做分区</li>
<li>MySql适合单表1000万~5000万行数据，很少人用MySql分区</li>
</ul>
<p>如果统一在应用层做拆分，数据库只负责存储，那么上面的方案适用于各种数据库。</p>
<p>同时，单表数据上限，就是大家常问的应该分为几张表？在系统生命周期内（一般1~2年），确保拆分后的每张表数据总量在1000万附近最佳。</p>
<p>根据<a href="https://www.cnblogs.com/nnhy/p/xcode_100billion.html" target="_blank" rel="noopener">《百亿级性能》</a>，常见分表策略如下：</p>
<ul>
<li>日志型时间序列表，如果每月数据不足1000万，则按月分表，否则按天分表。缺点是数据热点极为明显，适合热表、冷表、归档表的梯队架构，优点是批量写入和抽取性能显著；</li>
<li>状态表（订单、用户等），按Crc16哈希分表，以1000万为准，决定分表数量，向上取整为2的指数倍（为了好算）。数据冷热均匀，利于单行查询更新，缺点是不利于批量写入和抽取；</li>
<li>混合分表。订单表可以根据单号Crc16哈希分表，便于单行查找更新，作为宽表拥有各种明细字段，同时还可以基于订单时间建立一套时间序列表，作为冗余，只存储单号等必要字段。这样就解决了又要主键分表，又要按时间维度查询的问题。缺点就是订单数据需要写两份，当然，时间序列表只需要插入单号，其它更新操作不涉及。</li>
</ul>
<p>至于是否需要分库，主要由存储空间以及性能要求决定。</p>
<p>&nbsp;</p>
<div style="text-align: right"><a href="#_labelTop">回到目录</a><a name="_label3"></a></div><h1 id="autoid-3-0-0">分表与分区对比<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button></h1>
<p>还有一个很常见的问题，为什么使用分表而不是分区？</p>
<p>大型数据库Oracle、MSSQL、MySql都支持分区，前两者较多使用分区，MySql则较多分表。</p>
<p>分区和分表并没有本质的不同，两者都是为了把海量数据按照一定的策略拆分存储，以优化写入和查询。</p>
<ul>
<li>分区除了能建立子索引外，还可以建立全局索引，而分表不能建立全局索引；</li>
<li>分区能跨区查询，但非常非常慢，一不小心就扫描所有分区；</li>
<li>分表架构，很容易做成分库，支持轻易扩展到多台服务器上去，分区只能要求数据库服务器更强更大；</li>
<li>分区主要由DBA操作，分表主要由程序员控制；</li>
</ul>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p><span style="color: rgba(255, 0, 0, 1); font-size: 18px"><strong>！！！某项目使用XCode分表功能，已经过生产环境三年半考验，日均新增4000万~5000万数据量，2亿多次添删改，总数据量数百亿。</strong></span></p>
<p>&nbsp;</p>
<div style="text-align: right"><a href="#_labelTop">回到目录</a><a name="_label4"></a></div><h1 id="autoid-4-0-0">博文答疑<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button></h1>
<p>2019年9月9日晚上19点，钉钉企业群“新生命团队”，视频直播博文答疑。</p>
<p>今晚之后，如有问题，可以提问：<a href="https://github.com/NewLifeX/X/issues" target="_blank" rel="noopener">https://github.com/NewLifeX/X/issues</a></p>
<p><img src="https://img2018.cnblogs.com/blog/19592/201909/19592-20190909093022965-1901536155.png" alt="" width="486" height="872"></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<div style="text-align: right"><a href="#_labelTop">回到目录</a><a name="_label5"></a></div><h1 id="autoid-5-0-0">系列教程<button class="cnblogs-toc-button" title="显示目录导航" aria-expanded="false"></button></h1>
<p>NewLife.XCode教程系列[2019版]</p>
<ol>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_curd.html" target="_blank" rel="noopener">增删改查入门</a>。快速展现用法，代码配置连接字符串</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_model.html" target="_blank" rel="noopener">数据模型文件</a>。建立表格字段和索引，名字以及数据类型规范，推荐字段（时间，用户，IP）</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_entity.html" target="_blank" rel="noopener">实体类详解</a>。数据类业务类，泛型基类，接口</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_setting.html" target="_blank" rel="noopener">功能设置</a>。连接字符串，调试开关，SQL日志，慢日志，参数化，执行超时。代码与配置文件设置，连接字符串局部设置</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_negative.html" target="_blank" rel="noopener">反向工程</a>。自动建立数据库数据表</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_initdata.html" target="_blank" rel="noopener">数据初始化</a>。InitData写入初始化数据</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_curd_adv.html" target="_blank" rel="noopener">高级增删改</a>。重载拦截，自增字段，Valid验证，实体模型（时间，用户，IP）</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_dirty.html" target="_blank" rel="noopener">脏数据</a>。如何产生，怎么利用</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_additional.html" target="_blank" rel="noopener">增量累加</a>。高并发统计</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_transaction.html" target="_blank" rel="noopener">事务处理</a>。单表和多表，不同连接，多种写法</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_extend.html" target="_blank" rel="noopener">扩展属性</a>。多表关联，Map映射</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_search.html" target="_blank" rel="noopener">高级查询</a>。复杂条件，分页，自定义扩展FieldItem，查总记录数，查汇总统计</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_dbcache.html" target="_blank" rel="noopener">数据层缓存</a>。Sql缓存，更新机制</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_entitycache.html" target="_blank" rel="noopener">实体缓存</a>。全表整理缓存，更新机制</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_singlecache.html" target="_blank" rel="noopener">对象缓存</a>。字典缓存，适用用户等数据较多场景。</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_100billion.html" target="_blank" rel="noopener">百亿级性能</a>。字段精炼，索引完备，合理查询，充分利用缓存</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_factory.html" target="_blank" rel="noopener">实体工厂</a>。元数据，通用处理程序</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_membership.html" target="_blank" rel="noopener">角色权限</a>。Membership</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_import_export.html" target="_blank" rel="noopener">导入导出</a>。Xml，Json，二进制，网络或文件</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_division.html" target="_blank" rel="noopener">分表分库</a>。常见拆分逻辑</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_stat.html" target="_blank" rel="noopener">高级统计</a>。聚合统计，分组统计</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_batch.html" target="_blank" rel="noopener">批量写入</a>。批量插入，批量Upsert，异步保存</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_queue.html" target="_blank" rel="noopener">实体队列</a>。写入级缓存，提升性能。</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_backup.html" target="_blank" rel="noopener">备份同步</a>。备份数据，恢复数据，同步数据</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_service.html" target="_blank" rel="noopener">数据服务</a>。提供RPC接口服务，远程执行查询，例如SQLite网络版</li>
<li><a href="https://www.cnblogs.com/nnhy/p/xcode_bigdata.html" target="_blank" rel="noopener">大数据分析</a>。ETL抽取，调度计算处理，结果持久化&nbsp;</li>
</ol>
<br><hr></div>