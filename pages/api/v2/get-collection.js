import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Powergate from "~/node_common/powergate";

export default async (req, res) => {
  if (Strings.isEmpty(req.headers.authorization)) {
    return res.status(404).send({
      decorator: "NO_API_KEY_PROVIDED",
      error: true,
    });
  }

  const parsed = Strings.getKey(req.headers.authorization);

  const key = await Data.getAPIKeyByKey({
    key: parsed,
  });

  if (!key) {
    return res.status(403).send({
      decorator: "NO_MATCHING_API_KEY_FOUND",
      error: true,
    });
  }

  if (key.error) {
    return res.status(500).send({
      decorator: "ERROR_WHILE_VERIFYING_API_KEY",
      error: true,
    });
  }

  const user = await Data.getUserById({
    id: key.ownerId,
  });

  if (!user) {
    return res.status(404).send({ decorator: "API_KEY_OWNER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "ERROR_WHILE_LOCATING_API_KEY_OWNER", error: true });
  }

  let slateId = req.body.data ? req.body.data.id : null;
  let slate;

  if (Strings.isEmpty(slateId)) {
    return res.status(400).send({ decorator: "NO_ID_PROVIDED", error: true });
  }

  slate = await Data.getSlateById({ id: slateId, includeFiles: true, sanitize: true });

  if (!slate) {
    return res.status(404).send({
      decorator: "COLLECTION_NOT_FOUND",
      error: true,
    });
  }

  if (slate.error) {
    return res.status(500).send({
      decorator: "ERROR_WHILE_LOCATING_COLLECTION",
      error: true,
    });
  }

  if (!slate.isPublic) {
    return res.status(400).send({
      decorator: "COLLECTION_IS_PRIVATE",
      error: true,
    });
  }

  return res.status(200).send({ decorator: "V2_GET_COLLECTION", collection: slate });
};
