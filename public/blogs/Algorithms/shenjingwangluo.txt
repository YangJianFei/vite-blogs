/*
title:从零实现一个简单卷积神经网络
date:2021-10-03
keyword:深度学习,计算机视觉
*/

<div id="content_views" class="markdown_views prism-atom-one-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                        <path stroke-linecap="round" d="M5,0 0,2.5 5,5z" id="raphael-marker-block" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path>
                    </svg>
                    <p>对于卷积公式<br> <img src="https://img-blog.csdnimg.cn/14e9cebbb76344999787a50557261b7b.png" alt="在这里插入图片描述"><br> 可能有的人知道，可能有的人不知道，或者也仅仅只是知道而不理解。但是不管你知不知道这个公式的意义，都不影响你自己去实现一个卷积。他具体的数学意义，我先不讲，因为有很多人讲的都比我清楚透彻。而我要告诉你的，则是再卷积神经网络里面的卷积操作是如何实现的</p> 
<p>提到卷积神经网络，听到的最多的应该就是卷积，激活，池化这三个操作。就拿VGG16这个经典网络模型来说，其实就是通过卷积+激活+池化这三种操作堆叠而成的。</p> 
<p>那么他们具体是什么东西，又是如何实现的，这次就来用numpy手撸一下他们的具体实现原理。</p> 
<h1><a name="t0"></a><a id="_8"></a>卷积</h1> 
<p><img src="https://img-blog.csdnimg.cn/b4ecec302f664e3384540baa439bf930.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBASXNRdGlvbg==,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
<p>在神经网络中的卷积，就是<strong>利用一个卷积核在你的图像矩阵上滑动</strong>，上图中，假设<strong>灰色矩阵就是我们输入的图像矩阵</strong>，里面的数字就代表着图像中的像素值，<strong>绿色矩阵就是卷积核</strong>，灰色矩阵上面的<strong>绿色区域就是当前卷积核所覆盖的区域</strong>每次卷积核<strong>滑动的距离叫做步长</strong>，在上图中步长就是1。具体操作就是，将卷积核与在图像矩阵中所覆盖的区域<strong>对应位置相乘再相加</strong>，最后的蓝色矩阵就是这次卷积的结果。</p> 
<h3><a name="t1"></a><a id="Padding_13"></a>Padding</h3> 
<p>在上面的卷积操作中，原矩阵的大小是4x4，但是卷积完了之后就变成2x2的矩阵了，这是因为<strong>边缘上的像素永远不会位于卷积核中心，而卷积核也没法扩展到边缘区域以外</strong>。<br> 这个结果我们是不能接受的，有时我们还希望输入和输出的大小应该保持一致。为解决这个问题，可以在进行卷积操作前，对原矩阵进行<strong>边界填充（Padding）</strong>，也就是在矩阵的边界上填充一些值，以增加矩阵的大小，通常都用“<strong>0</strong>”来进行填充的。<br> <img src="https://img-blog.csdnimg.cn/576a720c8ade4d27b1dc7b2bc6639c13.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBASXNRdGlvbg==,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 对于卷积核大小为3的卷积，通常只需要在外围填充一圈0就足够了，对于不同大小的卷积核，为了使输出图像的大小一致，在图像外围填充多少圈0是不一样的，填充公式如下：<br> <img src="https://img-blog.csdnimg.cn/62a14dd2b2ac44b6be11280f22bb6631.png" alt="在这里插入图片描述"><br> <strong>P代表因该填充几圈，K代表卷积核的边长</strong>，卷积核通常都是奇数</p> 
<h3><a name="t2"></a><a id="_20"></a>多通道卷积</h3> 
<p>我们都知道，一张彩色图片是RGB三通道，也就是它的channel有3个，那么在这种多通道的情况下应该如何实现卷积操作呢。很简单，输入的图像有多少个通道，那么我们的卷积核也有多少个通道就可以了<br> <img src="https://img-blog.csdnimg.cn/af8f763b86f84a08bb3d9be575e8b706.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBASXNRdGlvbg==,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"><br> 跟单通道的卷积操作一样，把卷积核按照对应通道放在图片上滑动，对应位置相乘再相加，最后把三个通道得到的卷积结果加起来就行了</p> 
<h3><a name="t3"></a><a id="_24"></a>代码实现</h3> 
```
#input:输入的数据，input_channel:输入数据的通道数，out_channel:输出的特征图的通道数,kernel_size:卷积核的大小，stride:步长
def convolution(input,input_channel,out_channel,kernel_size,stride):
    kernel = np.random.randn(out_channel,input_channel,kernel_size,kernel_size)     #创建卷积核
    padding = int((kernel_size - 1) / 2)        #计算填充的大小
    padding_input = []
    # 进行对输入矩阵的填充
    for i in range(input_channel):
        padding_input.append(np.pad(input[i], ((padding, padding), (padding, padding)), 'constant', constant_values=(0, 0)))
    padding_input = np.array(padding_input)
    #根据填充后的输入尺寸，卷积核大小，步长，计算输出矩阵的大小
    out_size = int((len(input[0])+2*padding-kernel_size)/stride+1)
    # 创建一个0填充的输出矩阵
    out = np.zeros((out_channel,out_size,out_size))

    for i in range(out_channel):
        out_x = 0
        out_y = 0
        x_end = padding_input.shape[1] - padding - 1  # 卷积边界

        x = padding
        y = padding
        while x<=x_end:
            if y>padding_input.shape[1]-padding-1:      #卷积核超出右侧边界时，向下移动一个步长
                y = padding
                x = x+stride
                out_y = 0
                out_x = out_x + 1
                if x>x_end:
                    break
            #卷积操作
            out[i][out_x][out_y] = np.sum(padding_input[:,x-padding:x+padding+1,y-padding:y+padding+1]*kernel[i])

            y = y+stride
            out_y += 1

    return out
```
<h1><a name="t4"></a><a id="_64"></a>激活</h1> 
<p>就是对矩阵中的每个值都进行激活函数的运算，拿Relu举例，Relu就是大于0的不动，小于0的让它变为0：<br> <img src="https://img-blog.csdnimg.cn/46a527b1f06d44d9b8c6d4df36adcf09.png" alt="在这里插入图片描述"></p> 
<h3><a name="t5"></a><a id="_67"></a>代码实现</h3> 
<pre class="prettyprint"><code class="prism language-python has-numbering" onclick="mdcp.signin(event)" style="position: unset;"><span class="token keyword">def</span> <span class="token function">ReLu</span><span class="token punctuation">(</span><span class="token builtin">input</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    out <span class="token operator">=</span> np<span class="token punctuation">.</span>maximum<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span><span class="token builtin">input</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> out
<div class="hljs-button signin" data-title="登录后复制" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.4334&quot;}"></div></code><ul class="pre-numbering" style=""><li style="color: rgb(153, 153, 153);">1</li><li style="color: rgb(153, 153, 153);">2</li><li style="color: rgb(153, 153, 153);">3</li></ul></pre> 
<h1><a name="t6"></a><a id="_75"></a>池化</h1> 
<p>池化操作跟卷积操作其实很类似，都需要一个核在图片上进行滑动，对核覆盖的区域进行一些操作，只不过区别就在于，卷积的核里面有数字，卷积操作就是覆盖区域跟核做运算。而池化的核是空的。最常见的池化操作有最大池化，平均池化等。</p> 
<h3><a name="t7"></a><a id="_77"></a>最大池化</h3> 
<p>就是<strong>选出被核覆盖的区域中的最大值</strong><br> <img src="https://img-blog.csdnimg.cn/15884fe1850d45bc8f840a7acfa49f3f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBASXNRdGlvbg==,size_19,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
<h3><a name="t8"></a><a id="_80"></a>平均池化</h3> 
<p>就是<strong>选出被核覆盖区域中的平均值</strong><br> <img src="https://img-blog.csdnimg.cn/15ac75eb921a4b5ab3855d6d70e59052.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBASXNRdGlvbg==,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p> 
<h3><a name="t9"></a><a id="_83"></a>代码实现</h3> 
<p>以最大池化为例</p> 
```
#input:输入的数据，pooling_size:卷积核大小，stride:步长
def pooling(input,pooling_size,stride):
    out_size = int((len(input[0])-pooling_size)/stride+1)   #计算池化后的输出矩阵的大小
    out = np.zeros((len(input[0]),out_size,out_size))       #初始化输出矩阵
    # 对每个通道开始池化
    for i in range(input.shape[0]):
        out_x = 0
        out_y = 0
        in_x = 0
        in_y = 0
        #开始滑动
        while True:
            if out_y>=out_size:
                in_y = 0
                in_x+=pooling_size
                out_x+=1
                out_y = 0
                if out_x==out_size:
                    break
            #池化操作
            out[i][out_x][out_y] = np.max(input[i,in_x:in_x+pooling_size,in_y:in_y+pooling_size])
            in_y+=pooling_size
            out_y+=1
    return out
```
<h1><a name="t10"></a><a id="_112"></a>可视化</h1> 
<p>下面这是一次卷积操作输出的三个通道<br> <img src="https://img-blog.csdnimg.cn/f6563144ee37497aa7a84cd92b6a0894.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBASXNRdGlvbg==,size_17,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述"></p>
                </div>