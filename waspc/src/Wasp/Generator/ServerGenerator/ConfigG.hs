module Wasp.Generator.ServerGenerator.ConfigG
  ( genConfigFile,
    configFileInSrcDir,
  )
where

import Data.Aeson (object, (.=))
import Data.Char (toLower)
import StrongPath (File', Path', Rel, relfile, (</>))
import qualified StrongPath as SP
import Wasp.AppSpec (AppSpec)
import Wasp.AppSpec.Valid (isAuthEnabled, isPostgresUsed)
import Wasp.Generator.FileDraft (FileDraft)
import Wasp.Generator.Monad (Generator)
import qualified Wasp.Generator.ServerGenerator.Common as C

genConfigFile :: AppSpec -> Generator FileDraft
genConfigFile spec = return $ C.mkTmplFdWithDstAndData tmplFile dstFile (Just tmplData)
  where
    tmplFile = C.srcDirInServerTemplatesDir </> SP.castRel configFileInSrcDir
    dstFile = C.serverSrcDirInServerRootDir </> configFileInSrcDir
    tmplData =
      object
        [ "isAuthEnabled" .= (isAuthEnabled spec :: Bool),
          "isPostgresUsed" .= (map toLower . show $ isPostgresUsed spec)
        ]

configFileInSrcDir :: Path' (Rel C.ServerSrcDir) File'
configFileInSrcDir = [relfile|config.js|]
