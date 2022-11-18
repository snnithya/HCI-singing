"""
There's a fire starting in my heart
Reaching a fever pitch, it's bringing me out the dark
Finally I can see you crystal clear
Go ahead and sell me out and I'll lay your ship bare
See how I'll leave with every piece of you
Don't underestimate the things that I will do

"""
lyrics_word="""
    There's 0:00.439
    a 0:00.903
    fire 0:01.609
    starting 0:02.732
    in 0:03.311
    my 0:03.647
    heart 0:04.179
    
    reaching 0:05.000
    a 0:05.852
    fever 0:06.199
    pitch 0:06.778
    it's 0:07.000
    bringing 0:07.287
    me 0:07.760
    out 0:07.957
    the 0:08.200
    dark 0:08.334
    
    Finally 0:09.568
    I 0:11.176
    can 0:11.578
    see 0:11.909
    you 0:12.430
    crystal 0:12.446
    clear 0:13.112

    Go 0:14.136
    ahead 0:14.548
    and 0:15.000
    sell 0:15.306
    me 0:15.654
    out 0:15.916
    and 0:16.200
    I'll 0:16.500
    lay 0:16.770
    your 0:17.067
    ship 0:17.368
    bare 0:17.643
    
    See 0:18.761
    how 0:19.122
    I'll 0:19.896
    leave 0:20.468
    with 0:20.696
    every 0:20.827
    piece 0:21.601
    of 0:21.876
    you 0:22.173
    
    Don't 0:23.265
    under 0:23.703
    estimate 0:24.133
    the 0:25.295
    things 0:25.583
    that 0:25.881
    I 0:26.000
    will 0:26.453
    do 0:26.720
"""

# transfer the lyrics to a list and convert time to seconds
lyrics = lyrics_word.split()
lyrics = [lyrics[i:i+2] for i in range(0, len(lyrics), 2)]
for i in range(len(lyrics)):
    lyrics[i][1] = lyrics[i][1].split(':')
    lyrics[i][1] = float(lyrics[i][1][0]) * 60 + float(lyrics[i][1][1])

print(lyrics)