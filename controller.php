<?php

public function changeImage()
    {
        $this->loadModel('Users');
        $this->viewBuilder()->autoLayout(false);
        $this->autoRender = false;
        $this->set('title', 'Profile Update');
        if (isset($_FILES["file"])) {
            //$userId = $this->request->data('userId');
            $userId = $this->Auth->user('id');
            $user = $this->Users->get($userId);

            $file = $this->request->data('file');

            $cropedImage = $this->request->data('cropedImageContent');
            $pos = strpos($cropedImage, ',');
            $rest = substr($cropedImage, $pos);
            $data = base64_decode($rest);
            //$cropedImage = imagecreatefromstring($data);
            $name = $file['name'];
            $temp = explode('.', $name);
            $extention = array_pop($temp);
            // Upload
            $type = 'profile';
            $directoryPath = WWW_ROOT . 'img' . DS . 'upload' . DS . $type;
            // dd($directoryPath);
            if (!is_dir($directoryPath)) {
                mkdir($directoryPath);
            }
            $dir = WWW_ROOT . 'img' . DS . 'upload' . DS . $type . DS;
            $imageName = time() . '_' . $this->randomnum(7) . str_replace(" ", "", '.' . $extention);
            if (file_put_contents($dir . "/" . $imageName, $data)) {
                $srcFile1 = $dir . "/" . $user['image'];
                unlink($srcFile1);
                $user = $this->Users->patchEntity($user, array('image' => $imageName));
                if ($this->Users->save($user)) {
                    echo json_encode(['success' => true, 'message' => 'Your profile picture successfully changed!']);
                    return;
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Your profile picture not successfully changed!']);
                return;

            }
        }
        echo json_encode(['success' => false, 'message' => 'Your profile picture not successfully changed!']);
    }