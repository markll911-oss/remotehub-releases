# FFmpeg for RemoteHub Next

RemoteHub Next downloads these files the first time it needs FFmpeg, to merge video with audio or to make MP3s. The APK does not ship them, which keeps it about 35 MB smaller.

They are the unmodified `libffmpeg.zip.so` files from
`io.github.junkfood02.youtubedl-android:ffmpeg:0.18.1` on Maven Central
(https://repo1.maven.org/maven2/io/github/junkfood02/youtubedl-android/ffmpeg/0.18.1/),
renamed per CPU type. The app checks the SHA-256 values in `SHA256SUMS` before unpacking.
FFmpeg is licensed under the LGPL/GPL; see https://ffmpeg.org/legal.html and
https://github.com/yausername/youtubedl-android.
