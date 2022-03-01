/*
title:用普通摄像头测量距离
date:2021-11-24
keyword:深度学习,计算机视觉,摄像
*/

<div id="content_views" class="markdown_views prism-atom-one-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                        <path stroke-linecap="round" d="M5,0 0,2.5 5,5z" id="raphael-marker-block" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path>
                    </svg>
                    <p>近年来，由于无人机、<a href="https://so.csdn.net/so/search?q=%E6%97%A0%E4%BA%BA%E8%BD%A6&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E6%97%A0%E4%BA%BA%E8%BD%A6&amp;spm=1001.2101.3001.7020&quot;}">无人车</a>等技术的不断成熟，需要用到实时测距的场所也越来越多，如定位，避障，测速等，相比于其他测距方法，单目测距是利用一个摄像头进行视频拍摄，在图像中找到待测物体。这一系列动作，涉及到了物体的识别，相机的结构，坐标变换的一些知识，距离的获取是一个很广泛的课题，用摄像头来测距是其中一个方向，包括单目测距、双目测距、结构光测距等方法。<br> 在这里，我们主要用一个摄像头通过建立一定的<a href="https://so.csdn.net/so/search?q=%E6%A8%A1%E5%9E%8B&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E6%A8%A1%E5%9E%8B&amp;spm=1001.2101.3001.7020&quot;}">模型</a>来解决测距的问题。</p> 
<h2><a name="t0"></a><a id="1__2"></a>1. 安装包</h2> 
<p><code>python 3.7 或以上</code></p> 
<pre class="prettyprint"><code class="prism language-python has-numbering" onclick="mdcp.signin(event)" style="position: unset;">pip install cvzone
pip install mediapipe
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li></ul></pre> 
<h2><a name="t1"></a><a id="2_9"></a>2.成像原理</h2> 
<p>单目摄像头的模型可以近似考虑为针孔模型，如图所示<br> <img src="https://img-blog.csdnimg.cn/266063ee88924951a7a11dbbfec73b50.png" alt="在这里插入图片描述"></p> 
<ul><li>f: 焦距</li><li>W: 目标物体的实际宽度</li><li>w: 成像后的宽度</li><li>d: 物体与相机之间的实际距离或深度</li></ul> 
<p><strong>f 、d、w、W的之间的关系如下：</strong><br> <span class="katex--display"><span class="katex-display"><span class="katex"><span class="katex-mathml">
     
      
       
        
         
          d
         
         
          f
         
        
        
         =
        
        
         
          W
         
         
          w
         
        
       
       
        \frac{d}{f}=\frac{W}{w}
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 2.25188em; vertical-align: -0.88044em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.37144em;"><span class="" style="top: -2.314em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.10764em;">f</span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.677em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord mathdefault">d</span></span></span></span><span class="vlist-s">&ZeroWidthSpace;</span></span><span class="vlist-r"><span class="vlist" style="height: 0.88044em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right: 0.277778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.277778em;"></span></span><span class="base"><span class="strut" style="height: 2.04633em; vertical-align: -0.686em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.36033em;"><span class="" style="top: -2.314em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.02691em;">w</span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.677em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.13889em;">W</span></span></span></span><span class="vlist-s">&ZeroWidthSpace;</span></span><span class="vlist-r"><span class="vlist" style="height: 0.686em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></span></p> 
<h3><a name="t2"></a><a id="21__20"></a>2.1 相机校准</h3> 
<p>我们的目标是计算出目标物体的<code>距离d</code>,但前提需要知道<code>焦距f</code>,焦距f的计算公式如下：<br> <span class="katex--display"><span class="katex-display"><span class="katex"><span class="katex-mathml">
     
      
       
        
         f
        
        
         =
        
        
         
          
           w
          
          
           ∗
          
          
           d
          
         
         
          W
         
        
       
       
        f=\frac{w*d}{W}
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.88888em; vertical-align: -0.19444em;"></span><span class="mord mathdefault" style="margin-right: 0.10764em;">f</span><span class="mspace" style="margin-right: 0.277778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.277778em;"></span></span><span class="base"><span class="strut" style="height: 2.05744em; vertical-align: -0.686em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.37144em;"><span class="" style="top: -2.314em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.13889em;">W</span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.677em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.02691em;">w</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault">d</span></span></span></span><span class="vlist-s">&ZeroWidthSpace;</span></span><span class="vlist-r"><span class="vlist" style="height: 0.686em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></span><br> 我们可以将一个物体放在离摄像头已知的距离<code>d</code>,同时我们知道实际物体的宽度<code>W</code>,以及呈像后的宽度w，从而上述公式计算出焦距<code>f</code>。</p> 
<h3><a name="t3"></a><a id="22_d_26"></a>2.2 计算物体的距离d</h3> 
<p>相机校准后，<code>焦距f</code>的值即为已知，根据如下公式，可计算出目标物体的距离：<br> <span class="katex--display"><span class="katex-display"><span class="katex"><span class="katex-mathml">
     
      
       
        
         d
        
        
         =
        
        
         
          
           f
          
          
           ∗
          
          
           W
          
         
         
          w
         
        
       
       
        d=\frac{f*W}{w}
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.69444em; vertical-align: 0em;"></span><span class="mord mathdefault">d</span><span class="mspace" style="margin-right: 0.277778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.277778em;"></span></span><span class="base"><span class="strut" style="height: 2.05744em; vertical-align: -0.686em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.37144em;"><span class="" style="top: -2.314em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.02691em;">w</span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.677em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.10764em;">f</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault" style="margin-right: 0.13889em;">W</span></span></span></span><span class="vlist-s">&ZeroWidthSpace;</span></span><span class="vlist-r"><span class="vlist" style="height: 0.686em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></span><br> 如果我们知道已知物体的<code>W</code>,和成像后的<code>w</code>,就可以实时计算出目标物体的距离d。</p> 
<h2><a name="t4"></a><a id="3__31"></a>3 案例介绍</h2> 
<p><img src="https://img-blog.csdnimg.cn/22950af7239d4941b81e130afa0e9ef0.png" alt="在这里插入图片描述"><br> 本文以人脸两只眼睛的距离作为目标物体的<code>W</code>, 由于男性两只眼睛距离为<code>64mm</code>，女性两只眼睛距离为<code>62mm</code> ，我们这里取平均值<code>63</code>作为人脸眼睛的距离。因此计算人脸的距离，只需知道成像后的<code>w</code>，即可计算出人脸离摄像头的距离<code>d</code>.</p> 
<h3><a name="t5"></a><a id="31__35"></a>3.1 检测人脸</h3> 
```
import cv2
import cvzone
import cvzone.FaceMeshModule import FaceMeshDetector

# 检测人脸
detector=FaceMeshDetector(maxFaces=1)
cap=cv2.VideoCapture(0)

while True:
	success,img =cap.read()
	img,faces=detector.findFaceMesh(img)
	cv2.imshow("Image",img)
	cv2.waitKey(1)
```
<p><img src="https://img-blog.csdnimg.cn/345fa641bce341cda5323769d491621a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQEJhbmdCYW5n,size_18,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
<h3><a name="t6"></a><a id="32__52"></a>3.2 计算视频中双眼的距离</h3> 
```
import cv2
import cvzone
import cvzone.FaceMeshModule import FaceMeshDetector

# 检测人脸
detector=FaceMeshDetector(maxFaces=1)
cap=cv2.VideoCapture(0)

while True:
	success,img =cap.read()
	img,faces=detector.findFaceMesh(img)
	if faces:
		face =faces[0]
		pointLeft=face[145]     #左眼中心点坐标
		pointRight=face[375]    #右眼中心点坐标
		# 绘制人眼中心点并连线
		cv2.line(img,pointLeft,pointRight,(0,200,0),3)
		cv2.circle(img,pointLeft,5,(255,0,255),cv2.FILLED)
		cv2.circle(img,pointRight,5,(255,0,255),cv2.FILLED)
		w,_=detector.findDistance(pointLeft,pointRight)
		print(w)
			
	cv2.imshow("Image",img)
	cv2.waitKey(1)
```
<p><img src="https://img-blog.csdnimg.cn/9cecf2cf4044474ca72a2e47513445f2.png" alt="在这里插入图片描述"></p> 
<h3><a name="t7"></a><a id="33_f_80"></a>3.3 相机标定：计算焦距f</h3> 
```
import cv2
import cvzone
import cvzone.FaceMeshModule import FaceMeshDetector

# 检测人脸
detector=FaceMeshDetector(maxFaces=1)
cap=cv2.VideoCapture(0)

while True:
	success,img =cap.read()
	img,faces=detector.findFaceMesh(img)
	if faces:
		face =faces[0]
		pointLeft=face[145]     #左眼中心点坐标
		pointRight=face[375]    #右眼中心点坐标
		# 绘制人眼中心点并连线
		cv2.line(img,pointLeft,pointRight,(0,200,0),3)
		cv2.circle(img,pointLeft,5,(255,0,255),cv2.FILLED)
		cv2.circle(img,pointRight,5,(255,0,255),cv2.FILLED)
		w,_=detector.findDistance(pointLeft,pointRight)  #保持人脸到摄像头50cm下测量
		# Finding the Focal Length
		W=6.3 # 真实人脸间距 6.3cm
		d= 50 # 保持人脸到摄像头50cm的距离
		f=(w*d)/W
		print(f)
			
	cv2.imshow("Image",img)
	cv2.waitKey(1)
``` 
<h3><a name="t8"></a><a id="34___113"></a>3.4 计算人脸到相机的距离</h3> 
<p>根据上一步，相机标定的结果。假设计算出相机的<code>焦距f</code></p> 
<blockquote> 
 <p>f =840 mm</p> 
</blockquote> 
<p>根据公式：<br> <span class="katex--display"><span class="katex-display"><span class="katex"><span class="katex-mathml">
     
      
       
        
         d
        
        
         =
        
        
         
          
           f
          
          
           ∗
          
          
           W
          
         
         
          w
         
        
       
       
        d=\frac{f*W}{w}
       
      
     </span><span class="katex-html"><span class="base"><span class="strut" style="height: 0.69444em; vertical-align: 0em;"></span><span class="mord mathdefault">d</span><span class="mspace" style="margin-right: 0.277778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.277778em;"></span></span><span class="base"><span class="strut" style="height: 2.05744em; vertical-align: -0.686em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height: 1.37144em;"><span class="" style="top: -2.314em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.02691em;">w</span></span></span><span class="" style="top: -3.23em;"><span class="pstrut" style="height: 3em;"></span><span class="frac-line" style="border-bottom-width: 0.04em;"></span></span><span class="" style="top: -3.677em;"><span class="pstrut" style="height: 3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right: 0.10764em;">f</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right: 0.222222em;"></span><span class="mord mathdefault" style="margin-right: 0.13889em;">W</span></span></span></span><span class="vlist-s">&ZeroWidthSpace;</span></span><span class="vlist-r"><span class="vlist" style="height: 0.686em;"><span class=""></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></span><br> 即可计算出实时的人脸到摄像头的距离</p> 
```
import cv2
import cvzone
import cvzone.FaceMeshModule import FaceMeshDetector

# 检测人脸
detector=FaceMeshDetector(maxFaces=1)
cap=cv2.VideoCapture(0)

while True:
	success,img =cap.read()
	img,faces=detector.findFaceMesh(img)
	if faces:
		face =faces[0]
		pointLeft=face[145]     #左眼中心点坐标
		pointRight=face[375]    #右眼中心点坐标
		# 绘制人眼中心点并连线
		cv2.line(img,pointLeft,pointRight,(0,200,0),3)
		cv2.circle(img,pointLeft,5,(255,0,255),cv2.FILLED)
		cv2.circle(img,pointRight,5,(255,0,255),cv2.FILLED)
		w,_=detector.findDistance(pointLeft,pointRight)  #保持人脸到摄像头50cm下测量
		W=6.3 # 真实人脸间距 6.3cm
		# Finding the Focal Length
		# d= 50 # 保持人脸到摄像头50cm的距离
		# f=(w*d)/W
		# print(f)

		# Finding distance
		f = 840  # 根据相机标定的结果
		d = (W * f)/w
		print(d)
		cvzone.putTextRect(img,f'Depth:{int(d)}cm',(face[10][0]-100,face[10][1]-50),scale=2)
			
	cv2.imshow("Image",img)
	cv2.waitKey(1)
``` 
<p><img src="https://img-blog.csdnimg.cn/cf92de5a29094d4f8488959ce7b0203a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQEJhbmdCYW5n,size_18,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
<p>可以看到：人脸靠近相机d越来越小，远离相机d越来越小。从而可以大致判断出人脸离相机的距离。虽然达不到深度相机那么精确，但在某些场景中，该计算出的距离应用起来可以有不错的效果</p>
                </div>