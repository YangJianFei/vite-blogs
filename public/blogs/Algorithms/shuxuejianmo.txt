/*
title:2022美国大学生数学建模竞赛（美赛）思路&代码
date:2022-02-18
keyword:数学建模,竞赛
*/

<div id="content_views" class="markdown_views prism-atelier-sulphurpool-light">
                    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                        <path stroke-linecap="round" d="M5,0 0,2.5 5,5z" id="raphael-marker-block" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path>
                    </svg>
                    <p></p>
<div class="toc">
 <h3><a name="t0"></a>2022美国大学生<a href="https://so.csdn.net/so/search?q=%E6%95%B0%E5%AD%A6%E5%BB%BA%E6%A8%A1&amp;spm=1001.2101.3001.7020" target="" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E6%95%B0%E5%AD%A6%E5%BB%BA%E6%A8%A1&amp;spm=1001.2101.3001.7020&quot;}">数学建模</a>竞赛（美赛）思路&amp;代码</h3>
 <ul><li><a href="#_1" target="_self">报名</a></li><li><a href="#_4" target="_self">时间节点</a></li><li><a href="#_11" target="_self">比赛说明</a></li><li><ul><li><ul><li><a href="#A_23" target="_self">一.A题——赛题解读&amp;解题思路</a></li></ul>
  </li></ul>
  </li><li><a href="#B_discrete_26" target="_self">二.B 题(discrete)</a></li><li><ul><li><ul><li><a href="#C_32" target="_self">三.C题——赛题解读&amp;解题思路</a></li><li><a href="#D_operations_researchnetwork_science_37" target="_self">四.D题 (operations research/network science)</a></li><li><a href="#E_environmental_science_43" target="_self">五.E题 (environmental science)</a></li><li><a href="#F_policy_49" target="_self">六.F题 (policy)</a></li></ul>
  </li></ul>
  </li><li><a href="#_55" target="_self">七.资料</a></li></ul>
</div>
<p></p> 
<h1><a name="t1"></a><a id="_1"></a>报名</h1> 
<blockquote> 
 <p>官方<a href="https://so.csdn.net/so/search?q=%E7%BD%91%E5%9D%80&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E7%BD%91%E5%9D%80&amp;spm=1001.2101.3001.7020&quot;}">网址</a>:<a href="http://www.comap.com/undergraduate/contests/steps/index.html">http://www.comap.com/undergraduate/contests/steps/index.html</a><br> 官方规则：<a href="https://www.comap.com/undergraduate/contests/mcm/instructions.php">https://www.comap.com/undergraduate/contests/mcm/instructions.php</a></p> 
</blockquote> 
<h1><a name="t2"></a><a id="_4"></a>时间节点</h1> 
<blockquote> 
 <p>1.官方报名截止时间：2022 年2 月17 日下午3 点<br> 2.比赛开始时间：2022 年2 月17 日下午5 点<br> 3.比赛结束时间：2022 年2 月21 日下午8 点</p> 
</blockquote> 
<p><mark>先占个坑，比赛思路当天会更新…</mark></p> 
<h1><a name="t3"></a><a id="_11"></a>比赛说明</h1> 
<blockquote> 
 <ul><li>赛题原版（英文版）下载链接：<br> 链接：https://pan.baidu.com/s/1zplTzVn5Ba3acqWY2FaYtA<br> 提取码：cq37</li><li>赛题翻译（中文版）下载链接：<a href="https://download.csdn.net/download/qq_35759272/81263172">2022年数学建模美赛翻译（校苑数模中文版)</a></li><li>赛题翻译（校苑数模中文版）下载链接： 
   <ul><li>（推荐）</li></ul> </li></ul> 
</blockquote> 
<blockquote> 
 <p>&ensp;&ensp;&ensp;&ensp;大家不管看了谁的翻译文件（大部分都是机器翻译），英文版的一定要自己再看一遍，逐字推敲。<br> &ensp;&ensp;&ensp;&ensp;推荐大家一个很方便的PDF翻译软件（我们研究生经常用来看英文文献的）：知云文献翻译（可以在微信里面搜索，下载软件安装包）或者登录官网：<a href="https://www.zhiyunwenxian.cn/">https://www.zhiyunwenxian.cn/</a><br> <img src="https://img-blog.csdnimg.cn/20210205073531999.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM1NzU5Mjcy,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述"></p> 
</blockquote> 
<h3><a name="t4"></a><a id="A_23"></a>一.A题——赛题解读&amp;解题思路</h3> 
<blockquote> 
 <ul><li>赛题目的：</li><li>赛题解读&amp;解题思路链接：</li></ul> 
</blockquote> 
<h1><a name="t5"></a><a id="B_discrete_26"></a>二.B 题(discrete)</h1> 
<blockquote> 
 <p>&ensp;&ensp;&ensp;&ensp;B题主要是<mark>离散型</mark>赛题，常见出题点为回归或聚类分析、协同规划等以及运筹、决赛类问题；</p> 
</blockquote> 
<blockquote> 
 <ul><li>赛题目的：</li><li>赛题解读&amp;解题思路链接：</li></ul> 
</blockquote> 
<h3><a name="t6"></a><a id="C_32"></a>三.C题——赛题解读&amp;解题思路</h3> 
<blockquote> 
 <p>&ensp;&ensp;&ensp;&ensp;C题为<mark>大数据</mark>赛题，一般数据处理与分析是必不可少的，传统的统计学的统计推断、假设检验、回归分析、方差分析等多少也都会涉及到，然后进行相关的结论预测或数据挖掘等；</p> 
</blockquote> 
<blockquote> 
 <ul><li>赛题目的：</li><li>赛题解读&amp;解题思路链接：</li></ul> 
</blockquote> 
<h3><a name="t7"></a><a id="D_operations_researchnetwork_science_37"></a>四.D题 (<a href="https://so.csdn.net/so/search?q=operations&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=operations&amp;spm=1001.2101.3001.7020&quot;}">operations</a> research/network science)</h3> 
<blockquote> 
 <p>&ensp;&ensp;&ensp;&ensp;D题一般为<mark>图与复杂网络</mark>分析类、传播与扩散等相关；</p> 
</blockquote> 
<blockquote> 
 <ul><li>赛题目的：</li><li>赛题解读&amp;解题思路链接：</li></ul> 
</blockquote> 
<h3><a name="t8"></a><a id="E_environmental_science_43"></a>五.E题 (environmental science)</h3> 
<blockquote> 
 <p>&ensp;&ensp;&ensp;&ensp;E为<mark>环境科学</mark>类，多对环境状态进行评估或预测，以及对政策进行分析等，往往会有评价类的模型；</p> 
</blockquote> 
<blockquote> 
 <ul><li>赛题目的：采伐在内的森林管理可能有利于碳封存。森林管理者必须在采伐森林产品的价值与让森林继续生长和吸收碳的价值之间找到平衡。</li><li>赛题解读&amp;解题思路链接：<a href="https://yuanwenjie.blog.csdn.net/article/details/123013577">2022美赛E题（森林的碳封存）——赛题解读&amp;解题思路</a></li></ul> 
</blockquote> 
<h3><a name="t9"></a><a id="F_policy_49"></a>六.F题 (policy)</h3> 
<p>&ensp;&ensp;&ensp;&ensp;F题是<mark>政策类</mark>，针对全球出现的一些重大事件进行系统性的模拟与评价，对政策或措施进行效果评估等，往往会有评价类的模型</p> 
<blockquote> 
 <ul><li>赛题目的：</li><li>赛题解读&amp;解题思路链接：</li></ul> 
</blockquote> 
<h1><a name="t10"></a><a id="_55"></a>七.资料</h1> 
<p>1）往年优秀论文：<a href="https://download.csdn.net/download/qq_35759272/15043338">美国大学生数学建模竞赛2004-2020年优秀论文汇总</a><br> 2）各赛题的代码汇总：<a href="https://download.csdn.net/download/qq_35759272/15046825">美赛各题常用算法程序与参考代码.rar</a><br> <img src="https://img-blog.csdnimg.cn/20210204145255904.png" alt="在这里插入图片描述"></p> 
<p><img src="https://img-blog.csdnimg.cn/20210204145225497.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM1NzU5Mjcy,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述"><br> 注：第一次参加数学建模比赛的，推荐看一下这篇文章：<br> <a href="https://blog.csdn.net/qq_35759272/article/details/109179105">如何在数学建模比赛中稳拿奖——个人100%获奖经历分享</a></p>
                </div>