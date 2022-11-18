"""
Beauty queen of only eighteen, she had some trouble with herself
He was always there to help her, she always belonged to someone else
I drove for miles and miles, and wound up at your door
I've had you so many times, but somehow I want more
I don't mind spending every day
Out on your corner in the pouring rain
Look for the girl with the broken smile
Ask her if she wants to stay a while
And she will be loved
And she will be loved
"""

lyrics_word = """
    Beauty 0:02.754
    queen 0:03.317
    of 0:03.644
    only 0:04.220
    eighteen 0:05.372
    she 0:06.602
    had 0:07.455
    some 0:07.754
    trouble 0:08.067
    with 0:08.925
    herself 0:09.497
    
    He 0:12.225
    was 0:12.399
    always 0:12.763
    there 0:13.650
    to 0:14.172
    help 0:14.727
    her 0:15.398
    she 0:16.000
    always 0:16.540
    belonged 0:17.159
    to 0:18.000
    someone 0:18.241
    else 0:19.467
    
    I 0:21.849
    drove 0:22.153
    for 0:22.412
    miles 0:23.000
    and 0:23.628
    miles 0:24.129
    and 0:24.794
    wound 0:25.367
    up 0:25.930
    at 0:26.421
    your 0:27.070
    door 0:27.680
    
    I've 0:31.209
    had 0:31.563
    you 0:31.814
    so 0:32.398
    many 0:33.000
    times 0:33.580
    but 0:34.171
    somehow 0:34.711
    I 0:35.945
    want 0:35.945
    more 0:37.108
    
    I 0:40.328
    don't 0:40.704
    mind 0:40.971
    spending 0:41.488
    every 0:42.178
    day 0:43.024
    out 0:44.777
    on 0:45.106
    your 0:45.325
    corner 0:45.639
    in 0:46.282
    the 0:46.548
    pouring 0:46.846
    rain 0:47.865
    
    Look 0:49.448
    for 0:49.777
    the 0:50.043
    girl 0:50.325
    with 0:51.015
    the 0:51.234
    broken 0:51.563
    smile 0:52.300
    
    Ask 0:54.416
    her 0:54.745
    if 0:55.121
    she 0:55.325
    wants 0:55.670
    to 0:56.000
    stay 0:56.260
    a 0:56.593
    while 0:57.141
    
    And 0:57.737
    she 0:58.000
    will 0:58.341
    be 1:00.348
    loved 1:00.609
    
    And 1:02.392
    she 1:02.670
    will 1:03.013
    be 1:05.063
    loved 1:05.400

"""

# transfer the lyrics to a list and convert time to seconds
lyrics = lyrics_word.split()
lyrics = [lyrics[i:i+2] for i in range(0, len(lyrics), 2)]
for i in range(len(lyrics)):
    lyrics[i][1] = lyrics[i][1].split(':')
    lyrics[i][1] = float(lyrics[i][1][0]) * 60 + float(lyrics[i][1][1])

print(lyrics)