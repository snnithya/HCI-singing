"""
Fly me to the moon
Let me play among the stars
Let me see what spring is like on a-Jupiter and Mars
In other words, hold my hand
In other words, baby, kiss me
"""

lyrics_word = """
Fly 0:02.000
me 0:02.545
to 0:02.927
the 0:03.521
moon 0:03.826
Let 0:05.260
me 0:05.481
play 0:05.837
among 0:06.889
the 0:07.517
stars 0:07.848
Let 0:09.914
me 0:10.335
see 0:10.731
what 0:11.294
spring 0:11.663
is 0:12.285
like 0:12.818
on 0:13.372
a-Jupiter 0:14.942
and 0:15.580
Mars 0:15.926
In 0:17.897
other 0:18.058
words 0:18.331
hold 0:21.000
my 0:22.064
hand 0:22.443
In 0:26.074
other 0:26.259
words 0:26.500
darling 0:29.237
kiss 0:30.212
me 0:31.198
"""

# transfer the lyrics to a list and convert time to seconds
lyrics = lyrics_word.split()
lyrics = [lyrics[i:i+2] for i in range(0, len(lyrics), 2)]
for i in range(len(lyrics)):
    lyrics[i][1] = lyrics[i][1].split(':')
    lyrics[i][1] = float(lyrics[i][1][0]) * 60 + float(lyrics[i][1][1])

print(lyrics)