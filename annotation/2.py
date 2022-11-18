"""
Come up to meet you, tell you I'm sorry
You don't know how lovely you are
I had to find you, tell you I need you
Tell you I set you apart
Tell me your secrets and ask me your questions
Oh, let's go back to the start
Running in circles, coming up tails
Heads on a science apart
Nobody said it was easy
It's such a shame for us to part
Nobody said it was easy
No one ever said it would be this hard
Oh, take me back to the start
I was just guessing at numbers and figures
Pulling the puzzles apart
Questions of science, science and progress
Do not speak as loud as my heart
But tell me you love me, come back and haunt me
Oh and I rush to the start
"""

lyrics_word="""
    Come 0:00.291
    up 0:00.825
    to 0:01.127
    meet 0:01.610
    you 0:02.516
    tell 0:03.603
    you 0:04.089
    I'm 0:04.501
    sorry 0:04.773
    
    You 0:06.746
    don't 0:06.927
    know 0:07.385
    how 0:07.758
    lovely 0:08.190
    you 0:09.709
    are 0:10.212
    
    I 0:13.485
    had 0:13.888
    to 0:14.300
    find 0:14.581
    you 0:15.608
    tell 0:16.962
    you 0:17.273
    I 0:17.575
    need 0:18.000
    you 0:18.843
    
    Tell 0:20.071
    you 0:20.444
    I 0:20.877
    set 0:21.148
    you 0:22.105
    apart 0:22.900
    
    Tell 0:26.604
    me 0:27.097
    your 0:27.369
    secrets 0:27.691
    and 0:29.692
    ask 0:29.893
    me 0:30.336
    your 0:30.678
    questions 0:31.111
    
    Oh 0:33.114
    let's 0:33.527
    go 0:34.000
    back 0:35.472
    to 0:35.193
    the 0:36.000
    start 0:36.250
    
    Running 0:39.632
    in 0:40.387
    circles 0:40.769
    coming 0:42.923
    up 0:43.738
    tails 0:44.101
    
    Heads 0:46.224
    on 0:46.738
    a 0:47.000
    science 0:47.372
    apart 0:49.119
    
    Nobody 0:52.480
    said 0:54.000
    it 0:54.831
    was 0:55.203
    easy 0:55.715
    
    It's 0:58.939
    such 0:59.513
    a 1:00.164
    shame 1:00.536
    for 1:01.390
    us 1:01.824
    to 1:02.181
    part 1:02.615
    
    Nobody 1:05.526
    said 1:07.000
    it 1:08.000
    was 1:08.357
    easy 1:08.812
    
    No 1:12.000
    one 1:12.770
    ever 1:13.286
    said 1:14.000
    it 1:14.854
    would 1:15.285
    be 1:15.740
    this 1:16.159
    hard 1:16.893
    
    Oh 1:20.976
    take 1:21.466
    me 1:21.813
    back 1:22.324
    to 1:22.589
    the 1:23.039
    start 1:23.509
"""

# transfer the lyrics to a list and convert time to seconds
lyrics = lyrics_word.split()
lyrics = [lyrics[i:i+2] for i in range(0, len(lyrics), 2)]
for i in range(len(lyrics)):
    lyrics[i][1] = lyrics[i][1].split(':')
    lyrics[i][1] = float(lyrics[i][1][0]) * 60 + float(lyrics[i][1][1])

print(lyrics)