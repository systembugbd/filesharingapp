const path = require("path");
import { version } from "./../package.json";
import _, { toArray } from "lodash";
import File from "./models/file";
import Post from "./models/post";
import { ObjectID } from "mongodb";

import FilesArchiver from "./archiver";
import { EmailFileDownload } from "./email";

/**
 * AppRouter
 * @app
 * @setupRouter fn
 */

class AppRouter {
  constructor(app) {
    this.app = app;
    this.setupRouter();
  }

  setupRouter() {
    const app = this.app;

    const uploadDir = app.get("storageDir");
    const upload = app.get("upload");
    const client = app.get("db");
    // console.log(client, "client database")

    app.get("/", (req, res, next) => {
      return res.status(200).json({
        version: version,
      });
    });

    //File Upload route

    app.post("/api/upload", upload.array("files"), (req, res, next) => {
      let files = _.get(req, "files", []);
      let fileModels = [];

      //lodash foreach
      _.each(files, (fileObject) => {
        const newFile = new File(app).initWithFileObject(fileObject).toJSON();
        fileModels.push(newFile);
      });

      //File fileModels check
      if (fileModels.length) {
        const filesCollection = client.db().collection("files");

        //File collection insertMany files
        filesCollection.insertMany(fileModels, (err, result) => {
          if (err) {
            return res.status(503).json({
              error: {
                message: err.toString() + "Unable to save your files",
              },
            });
          }

          //Init with Post object with field with POST Class
          let post = new Post(app)
            .initWithObject({
              from: _.get(req, "body.from"),
              to: _.get(req, "body.to"),
              message: _.get(req, "body.message"),
              files: result.insertedIds,
            })
            .toJSON();

          const postsCollection = client.db().collection("posts");

          //Save post object to posts collections
          postsCollection.insertOne(post, (err, result) => {
            if (err) {
              return res.status(403).json({
                error: {
                  message: "Your upload could not be saved.",
                },
              });
            }

            /**
             * @param post
             * @callback(err, info)
             * Sending Email Class
             */
            const sendEmail = new EmailFileDownload(app).sendDownloadLink(
              post,
              (err, info) => {
                if (err) {
                  return res.status(403).json({
                    error: {
                      message: err,
                    },
                  });
                }
              }
            );

            return res.json(post);
          });
        });
      } else {
        return res.status(503).json({
          error: {
            message: "Files upload is requied",
          },
        });
      }
    });

    /**
     * app.get()
     * /api/download/:id
     * Received an id from req.param.id
     */

    //File Download Route
    app.get("/api/download/:id", (req, res, next) => {
      let fileId = req.params.id;

      // console.log("ID: ", fileId)

      client
        .db()
        .collection("files")
        .find({ _id: ObjectID(fileId) })
        .toArray((err, result) => {
          //get name value from of result object [0].name
          const fileName = _.get(result, "[0].name");

          if (err || !fileName) {
            return res.status(404).json({
              error: {
                message:
                  "File Could not found, please ask again for new file link",
              },
            });
          } else {
            let filepath = path.join(uploadDir, fileName);
            //_.get(result, 'name')

            return res.download(filepath, fileName, (err) => {
              if (err) {
                return res.status(404).json({
                  error: {
                    message: "File not found",
                  },
                });
              } else {
                console.log("File downloaded successfully...");
              }
            });
          }
        });
    });

    /**
     * /api/posts/:id
     * @param :id
     * Setting Post route in backedn /api/posts/:id to view details of post
     */

    app.get("/api/posts/:id", (req, res, next) => {
      const postId = _.get(req, "params.id");
      this.getPostsById(postId, (err, result) => {
        if (err) {
          return res.status(404).json({
            error: {
              message: "File not found",
            },
          });
        }

        return res.json(result);
      });
    });

    /**
     * /api/posts/:id/download
     * @param :id
     * @download as a zip file
     */
    app.get("/api/posts/:id/download", (req, res, next) => {
      const id = _.get(req, "params.id");

      this.getPostsById(id, (err, result) => {
        if (err) {
          return res.status(404).json({
            error: {
              message: "File not found",
            },
          });
        }

        //Download all file with in zip
        const zipFile = new FilesArchiver(
          app,
          id,
          _.get(result, "files", []),
          res
        ).download();
        return zipFile;
      });
    });

    console.log("App router is initiated...");
  }

  getPostsById(id, callback = () => {}) {
    const app = this.app;
    const client = app.get("db");

    const postId = id;

    let ObjectId = null;

    try {
      ObjectId = new ObjectID(postId);
    } catch (err) {
      return callback(err, null);
    }

    client
      .db()
      .collection("posts")
      .find({ _id: ObjectId })
      .limit(1)
      .toArray((err, results) => {
        let result = _.get(results, "[0]");

        if (err || !result) {
          return callback(err ? err : new Error("Files not found"));
        }

        let fileIds = _.get(result, "files", []);

        // let ids =new ObjectID('5fde4819755ade48d834c16b');
        let filesarr = [];
        _.each(fileIds, (file) => {
          filesarr.push(new ObjectID(file));
        });

        client
          .db()
          .collection("files")
          .find({ _id: { $in: filesarr } })
          .toArray((err, files) => {
            if (err || !files || !files.length) {
              return callback(
                err ? err : new Error("Files information not found in database")
              );
            }

            result.files = files;
            return callback(null, result);
          });
      }); //end
  }
}

export default AppRouter;
