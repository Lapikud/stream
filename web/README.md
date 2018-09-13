# Motion stream event viewer

this thing expects nginx that serves directory contents as json using
[autoindex_format](http://nginx.org/en/docs/http/ngx_http_autoindex_module.html#autoindex_format)

directory format has to be `<year>/<month>/<day>/<CAMX>/%Y-%m-%d_%H:%M:%S-%v`


motion.conf should look something like this

```

# under Image File Output
output_pictures best


# and filename config
snapshot_filename event/%Y/%m/%d/CAM%t/%Y-%m-%d_%H:%M:%S-%v
picture_filename event/%Y/%m/%d/CAM%t/%Y-%m-%d_%H:%M:%S-%v
movie_filename event/%Y/%m/%d/CAM%t/%Y-%m-%d_%H:%M:%S-%v
timelapse_filename event/%Y/%m/%d/CAM%t/%Y-%m-%d_%H:%M:%S-%v
```

