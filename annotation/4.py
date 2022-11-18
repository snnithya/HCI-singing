"""
Oh, yeah
Don't need permission
Made my decision to test my limits
'Cause it's my business
God as my witness
Start what I finished
Don't need no hold up
Taking control of this kind of moment
I'm locked and loaded
Completely focused my mind is open
All that you got, skin to skin, oh my God
Don't you stop, boy
Somethin' 'bout you
Makes me feel like a dangerous woman
Somethin' 'bout, somethin' 'bout
Somethin' 'bout you
Makes me wanna do things that I shouldn't
Somethin' 'bout, somethin' 'bout, somethin' 'bout
"""

lyrics_word = """
Don't 0:00.329
need 0:00.445
permission 0:00.765
Made 0:01.724
my 0:01.918
decision 0:02.131
to 0:03.148
test 0:03.313
my 0:03.594
limits 0:03.778
'Cause 0:06.000
it's 0:06.234
my 0:06.466
business 0:06.621
God 0:07.459
as 0:07.692
my 0:07.885
witness 0:08.143
Start 0:08.891
what 0:09.136
I 0:09.394
finished 0:09.639
Don't 0:11.795
need 0:12.000
no 0:12.272
hold 0:12.453
up 0:12.736
Taking 0:13.291
control 0:13.729
of 0:14.271
this 0:14.778
kind 0:15.000
of 0:15.216
moment 0:15.371

I'm 0:17.644
locked 0:17.829
and 0:18.097
loaded 0:18.272
Completely 0:19.065
focused 0:19.757
my 0:20.528
mind 0:20.717
is 0:20.940
open 0:21.172
All 0:23.314
that 0:24.301
you 0:24.473
got 0:24.679
skin 0:25.659
to 0:25.659
skin 0:26.000
oh 0:27.219
my 0:27.413
God 0:27.645
Don't 0:28.678
you 0:28.858
stop 0:29.000
boy 0:30.360
Somethin' 0:33.000
'bout 0:34.000
you 0:34.524
Makes 0:35.801
me 0:36.817
feel 0:37.202
like 0:37.841
a 0:38.268
dangerous 0:38.705
woman 0:40.187
Somethin' 0:41.393
'bout 0:42.296
somethin' 0:42.798
'bout 0:43.737
Somethin' 0:44.191
'bout 0:45.162
you 0:45.665
Makes 0:47.000
me 0:48.000
wanna 0:48.398
do 0:49.314
things 0:49.834
that 0:50.299
I 0:50.781
shouldn't 0:51.281
Somethin' 0:52.705
'bout 0:53.000
somethin' 0:54.107
'bout 0:55.000
somethin' 0:55.455
'bout 0:56.401
"""

# transfer the lyrics to a list and convert time to seconds
lyrics = lyrics_word.split()
lyrics = [lyrics[i:i+2] for i in range(0, len(lyrics), 2)]
for i in range(len(lyrics)):
    lyrics[i][1] = lyrics[i][1].split(':')
    lyrics[i][1] = float(lyrics[i][1][0]) * 60 + float(lyrics[i][1][1])

print(lyrics)