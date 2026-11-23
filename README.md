# FFmpeg for RemoteHub Next

RemoteHub Next downloads these files the first time it needs FFmpeg, to merge video with audio or to make MP3s. The APK does not ship them, which keeps it about 35 MB smaller.

They are the unmodified `libffmpeg.zip.so` files from
`io.github.junkfood02.youtubedl-android:ffmpeg:0.18.1` on Maven Central
(https://repo1.maven.org/maven2/io/github/junkfood02/youtubedl-android/ffmpeg/0.18.1/),
renamed per CPU type. The app checks the SHA-256 values in `SHA256SUMS` before unpacking.
FFmpeg is licensed under the LGPL/GPL; see https://ffmpeg.org/legal.html and
https://github.com/yausername/youtubedl-android.

## aria2 (faster downloads)

`aria2c-0.18.1-<cpu>.zip` are the unmodified `libaria2c.zip.so` files from
`io.github.junkfood02.youtubedl-android:aria2c:0.18.1` on Maven Central
(https://repo1.maven.org/maven2/io/github/junkfood02/youtubedl-android/aria2c/0.18.1/),
renamed per CPU type. They hold the shared libraries aria2 needs (built by the Termux project).
The app downloads them only when "faster downloads (aria2)" is turned on, and checks `SHA256SUMS`.
aria2 is licensed under the GPL v2; see https://github.com/aria2/aria2.
