import Standard from "../models/standardModel.js";

export const getStandardVersionInfo = async (standardId) => {

    const standard = await Standard.findById(
        standardId
    ).lean();

    if (!standard) {
        return null;
    }

    // Find other records belonging to the same
    // standard family.
    let familyStandards = [];

    if (standard.standardFamily) {

        familyStandards =
            await Standard.find({
                standardFamily:
                    standard.standardFamily
            })
                .select(
                    "code title version status latestVersion source"
                )
                .sort({
                    version: 1
                })
                .lean();
    }

    /*
     * We deliberately do NOT assume that the
     * highest year is the latest valid version.
     *
     * BIS authoritative data must establish
     * supersession/current status.
     */

    const activeVersions =
        familyStandards.filter(
            item => item.status === "ACTIVE"
        );

    const explicitLatestVersions =
        familyStandards.filter(
            item => item.latestVersion
        );

    let latestKnownVersion = null;
    let versionStatus =
        "NOT_ESTABLISHED";

    let confidence = "LOW";

    /*
     * If BIS data explicitly provides latestVersion,
     * we can use it.
     */
    if (standard.latestVersion) {

        latestKnownVersion =
            standard.latestVersion;

        if (
            standard.version &&
            standard.version ===
                standard.latestVersion
        ) {
            versionStatus = "CURRENT";
            confidence = "HIGH";
        } else {
            versionStatus = "NOT_CURRENT";
            confidence = "HIGH";
        }

    } else if (
        activeVersions.length === 1 &&
        standard.version
    ) {

        /*
         * If there is exactly one ACTIVE version
         * in the family, we can report that the
         * dataset has one active version.
         */
        latestKnownVersion =
            activeVersions[0].version;

        if (
            latestKnownVersion ===
            standard.version
        ) {
            versionStatus = "CURRENT";
            confidence = "MEDIUM";
        } else {
            versionStatus =
                "NOT_ESTABLISHED";
            confidence = "LOW";
        }

    } else {

        /*
         * Multiple ACTIVE records or missing version
         * information means we cannot safely decide.
         */
        latestKnownVersion = null;
        versionStatus =
            "NOT_ESTABLISHED";
        confidence = "LOW";
    }

    return {

        standard: {
            _id: standard._id,
            code: standard.code,
            title: standard.title,
            standardFamily:
                standard.standardFamily,
            version: standard.version,
            status: standard.status,
            latestVersion:
                standard.latestVersion,
            source: standard.source
        },

        versionCheck: {

            status: versionStatus,

            currentVersion:
                standard.version,

            latestKnownVersion,

            confidence,

            explanation:
                versionStatus === "CURRENT"
                    ? "The available BIS data identifies this version as current."
                    : versionStatus === "NOT_CURRENT"
                    ? "The available BIS data identifies another version as the latest known version."
                    : "The available BIS data does not establish a supersession or current-version relationship."
        },

        familyStandards
    };
};