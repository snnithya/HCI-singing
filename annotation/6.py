"""
I don't want a lot for Christmas
There is just one thing I need
I don't care about the presents underneath the Christmas tree
I just want you for my own
More than you could ever know
Make my wish come true
All I want for Christmas is you
"""

lyrics_word = """
I 0:01.683
don't 0:04.000
want 0:04.327
a 0:04.863
lot 0:05.353
for 0:05.844
Christmas 0:06.432
There 0:08.421
is 0:09.000
just 0:09.391
one 0:09.709
thing 0:10.276
I 0:10.729
need 0:11.500
I 0:12.937
don't 0:13.134
care 0:13.557
about 0:13.955
the 0:14.794
presents 0:15.229
underneath 0:16.692
the 0:17.735
Christmas 0:18.041
tree 0:19.000
I 0:20.245
just 0:20.859
want 0:21.399
you 0:21.872
for 0:22.220
my 0:22.652
own 0:23.000
More 0:24.387
than 0:25.000
you 0:25.283
could 0:25.922
ever 0:26.395
know 0:27.185
Make 0:29.494
my 0:29.779
wish 0:30.000
come 0:30.500
true 0:31.198
All 0:35.160
I 0:36.000
want 0:36.441
for 0:37.701
Christmas 0:38.308
is 0:41.820
you 0:46.194
"""

# transfer the lyrics to a list and convert time to seconds
lyrics = lyrics_word.split()
lyrics = [lyrics[i:i+2] for i in range(0, len(lyrics), 2)]
for i in range(len(lyrics)):
    lyrics[i][1] = lyrics[i][1].split(':')
    lyrics[i][1] = float(lyrics[i][1][0]) * 60 + float(lyrics[i][1][1])

print(lyrics)