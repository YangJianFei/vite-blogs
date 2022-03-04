/*
title:Redis6-雪崩、击穿、穿透、分布式锁
date:2021-12-19
keyword:redis,缓存,分布式
*/

<div id="content_views" class="htmledit_views">
                    <h2><a name="t0"></a>一、<a href="https://so.csdn.net/so/search?q=%E5%B8%83%E9%9A%86%E8%BF%87%E6%BB%A4%E5%99%A8&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E5%B8%83%E9%9A%86%E8%BF%87%E6%BB%A4%E5%99%A8&amp;spm=1001.2101.3001.7020&quot;}">布隆过滤器</a></h2> 
<p>上亿级别数据，怎么判断是否存在。数据<a href="https://so.csdn.net/so/search?q=%E9%9B%86%E5%90%88&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E9%9B%86%E5%90%88&amp;spm=1001.2101.3001.7020&quot;}">集合</a>已经存在了，判断某个元素是否存在。</p> 
<p>为了解决这个问题，布隆过滤器诞生了。<span style="color:#fe2c24;">它是一个很长的二机制数组（bitmap）和一些列的随机hash算法映射函数，主要判断一个集合是否在元素中存在</span>。<a href="https://so.csdn.net/so/search?q=%E7%BB%9F%E8%AE%A1&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E7%BB%9F%E8%AE%A1&amp;spm=1001.2101.3001.7020&quot;}">统计</a>结果不算准确。</p> 
<p>特点：</p> 
<ul><li>高效的插入和查询，占用空间小，返回结果是不确定的</li><li>一个元素如果判断结果为存在的时候元素<span style="color:#fe2c24;">不一定存在</span><span style="color:#0d0016;">（hash冲突），但是判断其不存在则一定不存在</span></li><li><span style="color:#0d0016;">可以添加元素，但是不能删除元素，因为删除元素会导致错误率增加</span></li><li><span style="color:#0d0016;">误判只会发生在没有添加过的元素，添加过的元素一定不会发生误判</span></li></ul>
<h3><a name="t1"></a>1、使用场景</h3> 
<ul><li><span style="color:#fe2c24;">解决缓存穿透：</span><span style="color:#0d0016;">key存放到布隆过滤器中，判断key是否存在，不存在直接返回</span></li><li>黑名单校验</li><li>……</li></ul>
<h3><a name="t2"></a>2、原理</h3> 
<p><a href="https://so.csdn.net/so/search?q=hash&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=hash&amp;spm=1001.2101.3001.7020&quot;}">hash</a>冲突：就是不同值通过相同的hash算法计算出相同的hashcode。所以没办法规避hash冲突。</p> 
<p>为了减少hash冲突，布隆过滤器使用了多个hash算法。</p> 
<p>添加key：</p> 
<p>使用多个hash<a href="https://so.csdn.net/so/search?q=%E5%87%BD%E6%95%B0&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-view="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E5%87%BD%E6%95%B0&amp;spm=1001.2101.3001.7020&quot;}" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E5%87%BD%E6%95%B0&amp;spm=1001.2101.3001.7020&quot;}">函数</a>对key进行hash运算得到一个整数索引值，对位数组长度进行取模运算得倒一个位置，每个hash算房都会得到一个不同的位置，将这几个位置都置为1就完成add操作。</p> 
<p><img alt="" height="451" src="https://img-blog.csdnimg.cn/47df5404b45e461b879827ab8f3e2af4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUctbmV0,size_20,color_FFFFFF,t_70,g_se,x_16" width="947"></p> 
<p>查询key：</p> 
<p>只要其中有一位是0就表示这个key不存在，但是如果都是1，则不一定存在，因为有可能是其它key计算的。</p> 
<p>因为没办法确定，这个索引位上的1是否是该key设置的，所以删除会导致误判率。实际元素不能超过布隆过滤器初始化数量，如果超过需要重建</p> 
<h3><a name="t3"></a>3、优缺点</h3> 
<p>优点：</p> 
<ul><li>快速判断元素是否存在，所占空间小</li></ul>
<p>缺点：</p> 
<ul><li>存在一定的误判率</li><li>无法删除元素</li></ul>
<h3><a name="t4"></a>4、布谷鸟过滤器</h3> 
<p>主要解决了布隆过滤器无法删除元素的问题。可以理解为布隆过滤器的下一代。</p> 
<h2><a name="t5"></a>二、缓存预热+缓存雪崩+缓存击穿+缓存穿透</h2> 
<h3><a name="t6"></a>1、缓存雪崩：鬼子进村（大批量key失效、<a href="https://so.csdn.net/so/search?q=redis&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-view="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=redis&amp;spm=1001.2101.3001.7020&quot;}" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=redis&amp;spm=1001.2101.3001.7020&quot;}">redis</a>挂掉）</h3> 
<p>解决办法：</p> 
<ul><li>redis高可用</li><li>本地缓存+限流&amp;降级</li><li>开启Redis持久化，可以快速恢复集群</li><li>注意key的过期时间设置，避免大批量key同时失效（出现概率不大）</li></ul>
<h3><a name="t7"></a>2、缓存击穿：鬼子炸碉堡（热点KEY失效）</h3> 
<p>解决办法：</p> 
<ul><li>互斥更新，互斥独占锁防止击穿（DCL）</li><li>热点KEY不设置过期时间</li><li>双缓存，村两份，在特别高并发的情况下可以，用空间换DB安全，两份缓存差异失效时间</li></ul>
<h3><a name="t8"></a>3、缓存穿透：特务进城（查询某个为空的数据，每次都访问DB，DB\缓存都没有）</h3> 
<p>解决办法：</p> 
<ul><li>使用布隆过滤器，保证查询之前判断KEY是否存在<img alt="" height="733" src="https://img-blog.csdnimg.cn/4d79c6d038e444bdb2e32b5c2f3870ff.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUctbmV0,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200">
  <ul><li>Guava 谷歌提供的，单机版</li><li>Redisson RBloomFilter，基于redis的过滤器（为什么不封装成AOP）</li><li>redis4之后，redis提供了补丁插件RedisBloom<img alt="" height="426" src="https://img-blog.csdnimg.cn/6a48d8024f774d06b3b939725fce1fcb.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUctbmV0,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200"></li></ul></li><li>空\默认值的缓存，但是无法处理恶意攻击，持续的访问不存在的KEY</li></ul>
<p><img alt="" height="453" src="https://img-blog.csdnimg.cn/425cf3aac0c34410967afd560d73705d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUctbmV0,size_20,color_FFFFFF,t_70,g_se,x_16" width="1200"></p> 
<h2><a name="t9"></a>三、Redis<a href="https://so.csdn.net/so/search?q=%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-view="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81&amp;spm=1001.2101.3001.7020&quot;}" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81&amp;spm=1001.2101.3001.7020&quot;}">分布式锁</a></h2> 
<p>由于单JVM的锁（synchronized和lock）无法适应分布式环境，所以就诞生了分布式锁，分布式锁其实就是借助中间件对资源进行加锁，常用的方式有：</p> 
<ul><li>zookeeper 分布式锁</li><li>redis 分布式锁</li><li>mysql 分布式锁：但是由于mysql的并发的问题，很少用到这个</li></ul>
<p>分布式锁应该具备的特性：</p> 
<ul><li>独占性：同一时间有且只有一个操作者对资源进行操作</li><li>高可用：能够承受着高并发，并且中间件的可用性必须高</li><li>防死锁：在操作者无法释放锁的时候，有补偿机制</li><li>不乱抢：一把锁的使用和解锁必须是用一个操作者，需要使用lua脚本，保证原子性<img alt="" height="180" src="https://img-blog.csdnimg.cn/d1c0b71a64d54f76b56c968cd28096ce.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUctbmV0,size_20,color_FFFFFF,t_70,g_se,x_16" width="970"><img alt="" height="133" src="https://img-blog.csdnimg.cn/e00f7768820c43fa87d9ef573bfbb9c2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUctbmV0,size_20,color_FFFFFF,t_70,g_se,x_16" width="952"></li><li>重入性：同一个操作者可以再次获得这个锁</li><li>锁的续命：<span style="color:#fe2c24;">使用redisson</span>&nbsp;</li><li>redis集群异步复制锁丢失：<span style="color:#fe2c24;">使用redisson</span>&nbsp;</li></ul>
<p>redis实现分布式锁，就是sexnx和expire 两个命令。</p> 
<p>官方见识使用<span style="color:#fe2c24;">redisson</span>来操作分布式锁，并且已经处理好无法释放的补偿机制、缓存续命问题，<span style="color:#fe2c24;">看门狗线程</span>。</p> 
<p>CAP原则：</p> 
<ul><li>一致行（C）：在分布式系统中，同一时刻个节点数据是否一致</li><li>可用性（A）：保证每个请求不论成功或者失败都有响应</li><li>分区容忍性（P）：系统中任意数据丢失或失败不会影响系统继续运行</li></ul>
<p><img alt="" height="555" src="https://img-blog.csdnimg.cn/2c4c5a36e4fa4238846237e13a2a7b73.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUctbmV0,size_20,color_FFFFFF,t_70,g_se,x_16" width="665"></p> 
<p>redis单机是CP、zookeeper集群是CP、redis集群是AP&nbsp;</p> 
<h3><a name="t10"></a>1、redisson分布式锁的原理</h3> 
<p>redis需要注意的要点：</p> 
<ul><li>不能出现死锁，并且需要补偿机制 
  <ul><li>增加超时时间</li><li>增加子线程处理无法删除的key</li></ul></li><li>不能出现误删 
  <ul><li>删除之前一定要确定是否是自己的锁</li></ul></li><li>缓存续命 
  <ul><li>增加子线程，定期检查线程是否还持有锁，如果有则延长过期时间，Redisson增加了“看门狗”</li></ul></li><li>redis主从复制丢失 
  <ul><li>多master节点，这样保证每个master都拥有锁的key，N(部署节点)=2X(宕机节点)+1，redisson提供了，同时想多个主机注册锁的方式<img alt="" height="214" src="https://img-blog.csdnimg.cn/ec0a072ef6704f83b73838beb309a4b2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATUctbmV0,size_20,color_FFFFFF,t_70,g_se,x_16" width="961"></li></ul></li></ul>
                </div>