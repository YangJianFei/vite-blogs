/*
title:手把手教你实现人脸识别，有手就行
date:2022-02-04
keyword:人工智能,深度学习,计算机视觉
*/

<div id="content_views" class="markdown_views prism-atom-one-light">
                    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                        <path stroke-linecap="round" d="M5,0 0,2.5 5,5z" id="raphael-marker-block" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path>
                    </svg>
                    <h2><a name="t0"></a><a id="_0"></a>应用领域</h2> 
<ul><li>金融领域。人脸识别当前在金融领域的应用最为广泛，当前国内金融领域监管要求严格，金融相关产品都需要实名认证，并且具有较高的安全性要求，活体识别，银行卡ocr识别，身份证ocr识别，人证对比等在各大手机银行，金融app，保险app等都已经成为不可或缺的一个环节</li><li>安保领域。目前大量的企业，住宅，社区，学校等安全管理越来越普及，人脸门禁系统已经成为非常普及的一种安保方式。</li><li>通行领域。很多城市的火车站已经安装了人脸识别通行设备，进行人证对比过检，有些城市的地铁站也可以通过人脸识别的方式进行地铁进出站通行。</li><li>泛娱乐领域。现在市场上火爆的美颜相机，网络直播，短视频等都是建立在人脸识别的基础上对人脸进行美颜和特效处理。</li><li>公安，司法领域。公安系统在追捕逃犯时也会利用人脸识别系统对逃犯进行定位，监狱系统目前也会对服刑人员通过人脸识别系统进行报警和安防</li><li>自助服务设备。如银行的自动提款机，无人超市等。</li><li>考勤及会务。如工作考勤，会议出席人脸墙等。目前人脸识别市场上的巨头主要有商场，也有很多领域内巨头公司投资的小公司。</li></ul> 
<h2><a name="t1"></a><a id="_9"></a>第一步：导入模块</h2> 
<p>dlib模块安装其实是比较繁琐的，要认真耐心点，可以参考：<a href="https://blog.csdn.net/weixin_46211269/article/details/122754736">dlib安装</a>，如果不行再看看别的教程。</p> 
<pre class="prettyprint"><code class="prism language-cpp has-numbering" onclick="mdcp.signin(event)" style="position: unset;">import sys
import cv2
import face_recognition #dlib 人脸识别库
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li><li style="color: rgb(153, 153, 153);">3</li></ul></pre> 
<h2><a name="t2"></a><a id="_17"></a>第二步：加载图片并数值化</h2> 
<p>测试图片为我的偶像：<br> <img src="https://img-blog.csdnimg.cn/28b96368754f4d3a9ac3b6382fef411c.png" alt="在这里插入图片描述"></p> 
<pre class="prettyprint"><code class="prism language-cpp has-numbering" onclick="mdcp.signin(event)" style="position: unset;">face_img<span class="token operator">=</span>face_recognition<span class="token punctuation">.</span><span class="token function">load_image_file</span><span class="token punctuation">(</span><span class="token string">'1.png'</span><span class="token punctuation">)</span>
<span class="token function">print</span><span class="token punctuation">(</span>face_img<span class="token punctuation">)</span>
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li></ul></pre> 
<p>打印结果：<br> <img src="https://img-blog.csdnimg.cn/e9c7c8e0acbe4d10897afa6b318989fe.png" alt="在这里插入图片描述"><br> 输出为三维图像矩阵，把图像转为矩阵。</p> 
<h2><a name="t3"></a><a id="_29"></a>第三步：获取图片中的人脸数据</h2> 
<p>提取人脸特征编码，并获取到人脸五官的位置：</p> 
<pre class="prettyprint"><code class="prism language-cpp has-numbering" onclick="mdcp.signin(event)" style="position: unset;">face_encodings<span class="token operator">=</span>face_recognition<span class="token punctuation">.</span><span class="token function">face_encodings</span><span class="token punctuation">(</span>face_img<span class="token punctuation">)</span>#进行特征提取向量化，获取人脸的编码
face_locations<span class="token operator">=</span>face_recognition<span class="token punctuation">.</span><span class="token function">face_locations</span><span class="token punctuation">(</span>face_img<span class="token punctuation">)</span>#五官对应的位置
<span class="token function">print</span><span class="token punctuation">(</span>face_encodings<span class="token punctuation">)</span>
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li><li style="color: rgb(153, 153, 153);">3</li></ul></pre> 
<p>图片中有几个人脸就有几个数组：<br> <img src="https://img-blog.csdnimg.cn/46bbe6fe460c4707bfdb6770c3a08089.png" alt="在这里插入图片描述"></p> 
<h2><a name="t4"></a><a id="_39"></a>第四步：人数计算</h2> 
<p>这里只做判断两个人是否为一个人，超出两个就退出了</p> 
<pre class="prettyprint"><code class="prism language-cpp has-numbering" onclick="mdcp.signin(event)" style="position: unset;">n<span class="token operator">=</span><span class="token function">len</span><span class="token punctuation">(</span>face_encodings<span class="token punctuation">)</span>
<span class="token function">print</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span>
#这里只做判断两个人是否为一个人，超出两个就退出了
<span class="token keyword">if</span> n<span class="token operator">&gt;</span><span class="token number">2</span><span class="token operator">:</span>
    <span class="token function">print</span><span class="token punctuation">(</span><span class="token string">'超过两个人'</span><span class="token punctuation">)</span>
    sys<span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li><li style="color: rgb(153, 153, 153);">3</li><li style="color: rgb(153, 153, 153);">4</li><li style="color: rgb(153, 153, 153);">5</li><li style="color: rgb(153, 153, 153);">6</li></ul></pre> 
<p>打印可以分出是两个人：<br> <img src="https://img-blog.csdnimg.cn/8e507c67bdef4a789e8576ac245442c0.png" alt="在这里插入图片描述"></p> 
<h2><a name="t5"></a><a id="_52"></a>第五步：人脸比较</h2> 
<pre class="prettyprint"><code class="prism language-cpp has-numbering" onclick="mdcp.signin(event)" style="position: unset;">#获取两个人的数据
face1<span class="token operator">=</span>face_encodings<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
face2<span class="token operator">=</span>face_encodings<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>

result<span class="token operator">=</span>face_recognition<span class="token punctuation">.</span><span class="token function">compare_faces</span><span class="token punctuation">(</span><span class="token punctuation">[</span>face1<span class="token punctuation">]</span><span class="token punctuation">,</span>face2<span class="token punctuation">,</span>tolerance<span class="token operator">=</span><span class="token number">0.6</span><span class="token punctuation">)</span>#人脸比较，，误差不超过<span class="token number">0.6</span>则可以，默认值也为<span class="token number">0.6</span>
<span class="token function">print</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span>
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li><li style="color: rgb(153, 153, 153);">3</li><li style="color: rgb(153, 153, 153);">4</li><li style="color: rgb(153, 153, 153);">5</li><li style="color: rgb(153, 153, 153);">6</li></ul></pre> 
<p>返回：<br> <img src="https://img-blog.csdnimg.cn/b98edf84e2894e87ad3fa63826eeb753.png" alt="在这里插入图片描述"><br> 判断出为不是同一个人。<br> 再稍微修改一下，让表达更清楚：</p> 
<pre class="prettyprint"><code class="prism language-cpp has-numbering" onclick="mdcp.signin(event)" style="position: unset;"><span class="token keyword">if</span> result<span class="token operator">==</span><span class="token punctuation">[</span>True<span class="token punctuation">]</span><span class="token operator">:</span>
    name<span class="token operator">=</span><span class="token string">'same'</span>
    <span class="token function">print</span><span class="token punctuation">(</span><span class="token string">'两个人为同一个人'</span><span class="token punctuation">)</span>
<span class="token keyword">else</span><span class="token operator">:</span>
    <span class="token function">print</span><span class="token punctuation">(</span><span class="token string">'两者不是同一个人'</span><span class="token punctuation">)</span>
    name<span class="token operator">=</span><span class="token string">'different'</span>
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li><li style="color: rgb(153, 153, 153);">3</li><li style="color: rgb(153, 153, 153);">4</li><li style="color: rgb(153, 153, 153);">5</li><li style="color: rgb(153, 153, 153);">6</li></ul></pre> 
<p>返回：<br> <img src="https://img-blog.csdnimg.cn/39fa8857cbfe42f6a7ef246ee543462f.png" alt="在这里插入图片描述"></p> 
<h2><a name="t6"></a><a id="_77"></a>第六步：框出人脸写上文字</h2> 
<p>获取两个人脸位置坐标：</p> 
<pre class="prettyprint"><code class="prism language-cpp has-numbering" onclick="mdcp.signin(event)" style="position: unset;"><span class="token keyword">for</span> i in <span class="token function">range</span><span class="token punctuation">(</span><span class="token function">len</span><span class="token punctuation">(</span>face_encodings<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">:</span>
    face_encoding<span class="token operator">=</span>face_encodings<span class="token punctuation">[</span><span class="token punctuation">(</span>i<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">]</span> #倒序获取
    face_location <span class="token operator">=</span> face_locations<span class="token punctuation">[</span><span class="token punctuation">(</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">]</span>
    <span class="token function">print</span><span class="token punctuation">(</span>face_location<span class="token punctuation">)</span>#获取人脸位置
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li><li style="color: rgb(153, 153, 153);">3</li><li style="color: rgb(153, 153, 153);">4</li></ul></pre> 
<p>返回：<br> <img src="https://img-blog.csdnimg.cn/9cd8257f2d1a4503a3a313b30e1c1623.png" alt="在这里插入图片描述"><br> 元祖四个数值分别表示框人脸矩形框的四个点坐标。</p> 
<p>获取到坐标后开始画框框并写上文字：</p> 
<pre class="prettyprint"><code class="prism language-cpp has-numbering" onclick="mdcp.signin(event)" style="position: unset;">top<span class="token punctuation">,</span>right<span class="token punctuation">,</span>bottom<span class="token punctuation">,</span>left<span class="token operator">=</span>face_location#确定出坐标
    #画框框
    cv2<span class="token punctuation">.</span><span class="token function">rectangle</span><span class="token punctuation">(</span>face_img<span class="token punctuation">,</span><span class="token punctuation">(</span>left<span class="token punctuation">,</span>top<span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token punctuation">(</span>right<span class="token punctuation">,</span>bottom<span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">,</span><span class="token number">0</span><span class="token punctuation">,</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span>#传参分别为：图片，坐标，RGB颜色<span class="token punctuation">,</span>框粗细
    #写字上去
    cv2<span class="token punctuation">.</span><span class="token function">putText</span><span class="token punctuation">(</span>face_img<span class="token punctuation">,</span>name<span class="token punctuation">,</span><span class="token punctuation">(</span>left<span class="token operator">-</span><span class="token number">10</span><span class="token punctuation">,</span>top<span class="token operator">-</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span>cv2<span class="token punctuation">.</span>FONT_HERSHEY_DUPLEX<span class="token punctuation">,</span><span class="token number">0.8</span><span class="token punctuation">,</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">,</span><span class="token number">255</span><span class="token punctuation">,</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">)</span>#传参数分别为：图片，文字，坐标，字体，字体大小，颜色，粗细
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li><li style="color: rgb(153, 153, 153);">3</li><li style="color: rgb(153, 153, 153);">4</li><li style="color: rgb(153, 153, 153);">5</li></ul></pre> 
<h2><a name="t7"></a><a id="_98"></a>第七步：显示处理好的图像</h2> 
<pre class="prettyprint"><code class="prism language-cpp has-numbering" onclick="mdcp.signin(event)" style="position: unset;">face_img_rgb<span class="token operator">=</span>cv2<span class="token punctuation">.</span><span class="token function">cvtColor</span><span class="token punctuation">(</span>face_img<span class="token punctuation">,</span>cv2<span class="token punctuation">.</span>COLOR_BGR2RGB<span class="token punctuation">)</span>#确保颜色不要混乱
#展示图像
cv2<span class="token punctuation">.</span><span class="token function">imshow</span><span class="token punctuation">(</span><span class="token string">'compare'</span><span class="token punctuation">,</span>face_img_rgb<span class="token punctuation">)</span>
#设置等待关闭
cv2<span class="token punctuation">.</span><span class="token function">waitKey</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li><li style="color: rgb(153, 153, 153);">3</li><li style="color: rgb(153, 153, 153);">4</li><li style="color: rgb(153, 153, 153);">5</li></ul></pre> 
<p>效果：<br> <img src="https://img-blog.csdnimg.cn/abe483be0df140d1a16f99e68d800b70.png" alt="在这里插入图片描述"><br> 你只需要按步骤敲代码即可为全部代码，当然为了便于大家直接cv,代码展示如下：</p> 
```
import sys
import cv2
import face_recognition #dlib 人脸识别库


face_img=face_recognition.load_image_file('1.png')
# print(face_img)

face_encodings=face_recognition.face_encodings(face_img)#进行特征提取向量化，获取人脸的编码
face_locations=face_recognition.face_locations(face_img)#五官对应的位置
# print(face_encodings)

n=len(face_encodings)
print(n)
#这里只做判断两个人是否为一个人，超出两个就退出了
if n>2:
    print('超过两个人')
    sys.exit()

#获取两个人的数据
face1=face_encodings[0]
face2=face_encodings[1]

result=face_recognition.compare_faces([face1],face2,tolerance=0.6)#人脸比较，，误差不超过0.6则可以，默认值也为0.6
# print(result)
if result==[True]:
    name='same'
    print('两个人为同一个人')
else:
    print('两者不是同一个人')
    name='different'


for i in range(len(face_encodings)):
    face_encoding=face_encodings[(i-1)] #倒序获取
    face_location = face_locations[(i - 1)]
    # print(face_location)#获取人脸位置

    top,right,bottom,left=face_location#确定出坐标
    #画框框
    cv2.rectangle(face_img,(left,top),(right,bottom),(255,0,0))#传参分别为：图片，坐标，RGB颜色,框粗细
    #写字上去
    cv2.putText(face_img,name,(left-10,top-10),cv2.FONT_HERSHEY_DUPLEX,0.8,(255,255,0),2)#传参数分别为：图片，文字，坐标，字体，字体大小，颜色，粗细

face_img_rgb=cv2.cvtColor(face_img,cv2.COLOR_BGR2RGB)#确保颜色不要混乱
#展示图像
cv2.imshow('compare',face_img_rgb)
#设置等待关闭
cv2.waitKey(0)
```
<p>标出了两个人脸并写上为different，就是不同的意思，当然本篇文章为了给大家简单介绍实现<a href="https://so.csdn.net/so/search?q=%E4%BA%BA%E8%84%B8%E8%AF%86%E5%88%AB&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E4%BA%BA%E8%84%B8%E8%AF%86%E5%88%AB&amp;spm=1001.2101.3001.7020&quot;}">人脸识别</a>，并没有做过多的复杂实现，近段时间我研究人脸识别也做了一些复杂的功能实现，感兴趣也可以一起聊聊。</p> 
<h2><a name="t8"></a><a id="_171"></a>更高阶的人脸识别项目</h2> 
<p>毕业设计： <a href="https://blog.csdn.net/weixin_46211269/article/details/122785878">人脸识别</a></p>
                </div>